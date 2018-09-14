import Dimensions from "../../../src/api/components/box/Dimensions";
import { Types } from "../Constants.tests";

it('volume', () => expect(new Dimensions(1, 2, 3).volume).toBe(6));
it('json import', () => { expect(
    (() => {
        let jsonData = {
            type: Types.Dimensions,
            width: 1,
            length: 2,
            height: -3
        };
        let dimensions = Dimensions.FromJSON(jsonData);
        return Dimensions.Assert(dimensions) && dimensions.volume === 6;
    })()
).toBe(true)})