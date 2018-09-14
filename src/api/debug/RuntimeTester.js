
const active = true;
var RuntimeTester = {
    Notify: function(){},
    Test: function(){},
    Log: function(){
        return 'RuntimeTester is not active';
    }
};

if(active){

    /** @type {Map<string, Test>} */
    var tests = new Map();

    class TestLog{
        constructor(){
            this.successes = [];
            this.failures = [];
        }

        /** @param {Trial} trial */
        Succeeded(trial){
            this.successes.push(trial);
        }

        /** @param {Trial} trial */
        Failed(trial){
            this.failures.push(trial);
        }
    }

    class Test{
        constructor(title, maximumRuns){
            this.title = title;
            this.maximumRuns = isNaN(maximumRuns) ? Number.MAX_SAFE_INTEGER : maximumRuns;

            /** @type {Array<Trial>} */
            this.trials = [];
            this.runsCount = 0;

            this.log = new TestLog();
        }

        TryInstance(testFunction, expectedResult){
            if(this.runsCount < this.maximumRuns){
                let trial = new Trial(testFunction, expectedResult).BindTo(this);
                this.trials.push(trial);
                trial.Execute();

                if(trial.success) this.log.Succeeded(trial);
                else this.log.Failed(trial);

                this.runsCount++;
            }
        }

        Log(){
            let log = {
                succeeded: this.log.failures.length === 0,
                failures: null
            };

            if(this.log.failures.length > 0){
                log.failures = this.log.failures
            }

            return log;
        }
    }

    class TrialLog{
        constructor(){
            this.result = undefined;
            this.error = undefined;
        }
    }

    class Trial{
        /**
         * @param {Function} testFunction 
         * @param {*} expectedResult 
         */
        constructor(testFunction, expectedResult){
            this.testFunction = testFunction;
            this.expectedResult = expectedResult;

            this.log = new TrialLog();
        }

        /** @param {Test} test */
        BindTo(test){
            this.test = test;
            return this;
        }

        Execute(){
            let result = null;
            try{
                result = this.testFunction();
            }
            catch(error){
                this.log.error = error;
                console.warn('RuntimeTester.error:', error);
            }

            this.log.result = result;
        }

        get success(){
            let success = this.log.result === this.expectedResult;
            return success;
        }
    }

    RuntimeTester = class RuntimeTester{

        /**
         * @param {string} title - also a unique id
         * @param {Number} [maximumRuns] Number.MAX_SAFE_INTEGER
         */
        static Notify(title, maximumRuns){
            if(active === false) return false;

            let test = new Test(title, maximumRuns);
            tests.set(title, test);
            return test;
        }

        /**
         * @param {string} title - also a unique id
         * @param {Function} testFunction 
         * @param {*} expectedResult 
         */
        static Test(title, testFunction, expectedResult){
            if(active === false) return false;

            let test = tests.get(title);
            if(!test){
                console.warn('RuntimeTester was not notified of :' + title);
                test = RuntimeTester.Notify(title, maximumRuns);
            }

            test.TryInstance(testFunction, expectedResult);
            return test;
        }

        static Log(){
            if(active === false) return 'RuntimeTester is not active';

            let log = {
                pass: true,
                successful: [],
                failed: [],
                skipped: []
            };

            let testValues = tests.values();

            for(let test of testValues){
                let testRuns = test.runsCount;
                if(testRuns === 0){
                    log.skipped.push(test);
                }
                else{
                    let testSuccessful = test.log.failures.length === 0;
                    if(testSuccessful){
                        log.successful.push(test);
                    }
                    else{
                        log.pass = false;
                        log.failed.push(test);
                    }
                }
            }

            return log;
        }
    };
}

export default RuntimeTester;