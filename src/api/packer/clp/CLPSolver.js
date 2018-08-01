import { ThisWorkbook, Cells, CheckWorksheetExistence, Range, Application } from "./Workbook";
import Signaler from "../../utils/cik/Signaler";

/** Javascript port by chadiik 2018
 * 
 * CLP Spreadsheet Solver v1.1
 * Open source, developed by Dr. Gunes Erdogan
 * http://people.bath.ac.uk/ge277/index.php/clp-spreadsheet-solver/
 * 'This work is licensed under the Creative Commons Attribution 4.0 International License.; <=view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/.
 */

const epsilon = 0.0001;

//data declarations

class item_type_data{
    /**
     * @param {Number} id 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} length 
     */
    constructor(id, width, height, length){
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length
        this.volume = width * height * length;
        this.weight = 0;
        this.xy_rotatable = true;
        this.yz_rotatable = true;
        this.mandatory = 0;
        this.profit = 0;
        this.number_requested = 1;
        this.sort_criterion = 0;
    }
}

class item_list_data{
    constructor(){
        this.num_item_types = 0;
        this.total_number_of_items = 0;
        /** @type {Array<item_type_data>} */
        this.item_types;
    }

    item_typesGet(index){ if(index === 0){ console.warn('0 index'); } return this.item_types[index]; }
}

var item_list = new item_list_data();

class container_type_data{
    constructor(){
        this.type_id = 0;
        this.width = 0;
        this.height = 0;
        this.length = 0;
        this.volume_capacity = 0;
        this.weight_capacity = 0;
        this.mandatory = 0;
        this.cost = 0;
        this.number_available = 0;
    }
}

class container_list_data{
    constructor(){
        this.num_container_types = 0;
        /** @type {Array<container_type_data>} */
        this.container_types;
    }

    container_typesGet(index){ if(index === 0){ console.warn('0 index'); } return this.container_types[index]; }
}

var container_list = new container_list_data();

class compatibility_data{
    constructor(){
        /** @type {Array<Boolean>} */
        this.item_to_item;
        /** @type {Array<Array<Boolean>>} */
        this.container_to_item;
    }

    item_to_itemGet(index, index2){ if(index === 0 || index2 === 0){ console.warn('0 index'); } return this.item_to_item[index][index2]; }
    container_to_itemGet(index, index2){ if(index === 0 || index2 === 0){ console.warn('0 index'); } return this.container_to_item[index][index2]; }
}

var compatibility_list = new compatibility_data();

class item_location{
    constructor(){
        this.origin_x = 0;
        this.origin_y = 0;
        this.origin_z = 0;
        this.next_to_item_type = 0;
    }
}

class item_in_container{
    constructor(){
        this.item_type = 0;
        this.rotation = 0; //1 to 6
        this.mandatory = 0;
        this.origin_x = 0;
        this.origin_y = 0;
        this.origin_z = 0;
        this.opposite_x = 0;
        this.opposite_y = 0;
        this.opposite_z = 0;
    }

    static ResolveOrientation(rotationNum){
        const orientations_base1 = ['xyz', 'xyz', 'zyx', 'xzy', 'yzx', 'yxz', 'zxy'];
        return orientations_base1[rotationNum];
    }
}

class container_data{
    constructor(){
        this.type_id = 0;
        this.width = 0;
        this.height = 0;
        this.length = 0;
        this.volume_capacity = 0;
        this.weight_capacity = 0;
        this.cost = 0;
        this.item_cnt = 0;
        this.mandatory = 0;
        this.addition_point_count = 0;
        this.volume_packed = 0;
        this.weight_packed = 0;

        /** @type {Array<item_in_container>} */
        this.items;
        /** @type {Array<item_location>} */
        this.addition_points;
        /** @type {Array<Number>} */
        this.repack_item_count;
    }

    itemsGet(index){ if(index === 0){ console.warn('0 index'); } return this.items[index]; }
    addition_pointsGet(index){ if(index === 0){ console.warn('0 index'); } return this.addition_points[index]; }
    repack_item_countGet(index){ if(index === 0){ console.warn('0 index'); } return this.repack_item_count[index]; }
}

class solution_data{
    constructor(){
        this.feasible = false;

        this.num_containers = 0;
        this.net_profit = 0;
        this.total_volume = 0;
        this.total_weight = 0;
        this.total_distance = 0;
        this.total_x_moment = 0;
        this.total_yz_moment = 0;

        /** @type {Array<container_data>} */
        this.container;
        /** @type {Array<Array<Number>>} */
        this.rotation_order;
        /** @type {Array<Number>} */
        this.item_type_order;
        /** @type {Array<Number>} */
        this.unpacked_item_count;
    }

    containerGet(index){ if(index === 0){ console.warn('0 index'); } return this.container[index]; }
    item_type_orderGet(index){ if(index === 0){ console.warn('0 index'); } return this.item_type_order[index]; }
    unpacked_item_countGet(index){ if(index === 0){ console.warn('0 index'); } return this.unpacked_item_count[index]; }
}

class instance_data{
    constructor(){
        this.front_side_support = false;
        this.item_item_compatibility_worksheet = false; // true if the data exists
        this.container_item_compatibility_worksheet = false; // true if the data exists
    }
}

var instance = new instance_data();

class solver_option_data{
    constructor(){
        this.CPU_time_limit = 0;
        this.item_sort_criterion = 0;
        this.show_progress = false;
    }
}

var solver_options = new solver_option_data();

/**
 * 
 * @param {solution_data} solution 
 * @param {Number} random_reorder_probability 
 */
function SortContainers(solution, random_reorder_probability){
    
    var i = 0;
    var j = 0;
    var candidate_index = 0;
    var max_mandatory = 0;
    var max_volume_packed = 0;
    var min_ratio = 0;

    /** @type {container_data} */
    var swap_container;
        
    // insertion sort

    if( Math.random() < (1 - random_reorder_probability) ){
        // insertion sort
        for( i = 1; i <= solution.num_containers; i++ ){
            let container = solution.containerGet(i);
            candidate_index = i;
            max_mandatory = container.mandatory;
            max_volume_packed = container.volume_packed;
            min_ratio = container.cost / container.volume_capacity;
    
            for( j = i + 1; j <= solution.num_containers; j++ ){
                let container2 = solution.containerGet(j);
                if (
                    (container2.mandatory > max_mandatory)
                    || ((container2.mandatory === max_mandatory) && (container2.volume_packed > max_volume_packed + epsilon)) 
                    || ((container2.mandatory === 0) && (max_mandatory === 0) && (container2.volume_packed > max_volume_packed - epsilon) && ((container2.cost / container2.volume_capacity) < min_ratio))
                ){
                    candidate_index = j;
                    max_mandatory = container2.mandatory;
                    max_volume_packed = container2.volume_packed;
                    min_ratio = container2.cost / container2.volume_capacity;
                }
    
            }
    
            if( candidate_index != i ){
                swap_container = solution.containerGet(candidate_index);
                solution.container[candidate_index] = solution.containerGet(i);
                solution.container[i] = swap_container;
            }
        }
    }
    else {
        for( i = 1; i <= solution.num_containers; i++){
            candidate_index = Math.floor((solution.num_containers - i + 1) * Math.random() + i);

            if( candidate_index != i ){
                swap_container = solution.containerGet(candidate_index);
                solution.container[candidate_index] = solution.containerGet(i);
                solution.container[i] = swap_container;
            }
        }
    }
    
}


/**
 * 
 * @param {solution_data} solution 
 * @param {Number} container_id 
 * @param {Number} percent_time_left 
 */
function PerturbSolution(solution, container_id, percent_time_left){
    
    var i = 0;
    var j = 0;
    var k = 0;
    var swap_long = 0;
    var operator_selection = 0;
    var container_emptying_probability = 0;
    var item_removal_probability = 0;
    var repack_flag = false;
    var continue_flag = false;
    
    var max_z = 0;
    
    //With solution.containerGet(container_id)
    let container = solution.containerGet(container_id);
    
    // test
    
    container_emptying_probability = 0.05 + 0.15 * percent_time_left
    item_removal_probability = 0.05 + 0.15 * percent_time_left
    
    if( container.item_cnt > 0 ){

        if (Math.random() < container_emptying_probability ){
            
            // empty the container
            for( j = 1; j <= container.item_cnt; j++ ){
                let jType = container.itemsGet(j).item_type;
                solution.unpacked_item_count[jType] = solution.unpacked_item_countGet(jType) + 1;
                solution.net_profit = solution.net_profit - item_list.item_typesGet(jType).profit;
            }
            
            solution.net_profit = solution.net_profit + container.cost;
            solution.total_volume = solution.total_volume - container.volume_packed;
            solution.total_weight = solution.total_weight - container.weight_packed;
            
            container.item_cnt = 0;
            container.volume_packed = 0;
            container.weight_packed = 0;
            container.addition_point_count = 1;
            container.addition_points[1].origin_x = 0;
            container.addition_points[1].origin_y = 0;
            container.addition_points[1].origin_z = 0;
        }
        else{
            repack_flag = false;
            operator_selection = Math.random();
            
            if ( operator_selection < 0.3 ){

                for( j = 1; j < container.item_cnt; j++ ){
                    let jItem = container.itemsGet(j);

                    if ( (solution.feasible === false && jItem.mandatory === 0) || (Math.random() < item_removal_probability) ){
                        let jType = jItem.item_type;
                        solution.unpacked_item_count[jType] = solution.unpacked_item_countGet(jType) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(jType).profit;
                        jItem.item_type = 0;

                        repack_flag = true;
                    }
                }
               
            }
            else if( operator_selection < 0.3 ){ // ???
                max_z = 0;
                for( j = 1 ; j <= container.item_cnt; j++){
                    if( max_z < container.itemsGet(j).opposite_z ) max_z = container.itemsGet(j).opposite_z;
                }
                
                max_z = max_z * (0.1 + 0.5 * percent_time_left * Math.random());
                
                for( j = 1; j <= container.item_cnt; j++){
                    let jItem = container.itemsGet(j);

                    if ( ((solution.feasible === false) && (jItem.mandatory === 0)) || (jItem.opposite_z < max_z) ){
                        let jType = jItem.item_type;
                        solution.unpacked_item_count[jType] = solution.unpacked_item_countGet(jType) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(jType).profit;
                        jItem.item_type = 0;

                        repack_flag = true;
                    }
                }
            }
            else{
                
                max_z = 0;
                for( j = 1; j <= container.item_cnt; j++){
                    if( max_z < container.itemsGet(j).opposite_z ) max_z = container.itemsGet(j).opposite_z;
                }
                
                max_z = max_z * (0.6 - 0.5 * percent_time_left * Math.random());
                
                for( j = 1; j <= container.item_cnt; j++){
                    let jItem = container.itemsGet(j);

                    if( ((solution.feasible === false) && (jItem.mandatory === 0)) || (jItem.opposite_z > max_z) ){
                        let jType = jItem.item_type;
                        solution.unpacked_item_count[jType] = solution.unpacked_item_countGet(jType) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(jType).profit;
                        jItem.item_type = 0;

                        repack_flag = true;
                    }
                }
            }

            if( repack_flag ){

                for( j = 1; j <= container.item_cnt; j++){
                    if( container.itemsGet(j).item_type > 0 )
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(container.itemsGet(j).item_type).profit;
                }
                
                solution.net_profit = solution.net_profit + container.cost;
                solution.total_volume = solution.total_volume - container.volume_packed;
                solution.total_weight = solution.total_weight - container.weight_packed;

                for( j = 1;  j <= item_list.num_item_types; j++ ){
                    container.repack_item_count[j] = 0;
                }

                for( j = 1 ; j <= container.item_cnt; j++ ){
                    if( container.itemsGet(j).item_type > 0 )
                        container.repack_item_count[container.itemsGet(j).item_type] = container.repack_item_countGet(container.itemsGet(j).item_type) + 1;
                }

                container.volume_packed = 0;
                container.weight_packed = 0;
                container.item_cnt = 0;
                container.addition_point_count = 1;
                container.addition_points[1].origin_x = 0;
                container.addition_points[1].origin_y = 0;
                container.addition_points[1].origin_z = 0;

                // repack now

                for( j = 1; j <= item_list.num_item_types; j++ ){
                    continue_flag = true;
                    while( (container.repack_item_countGet(solution.item_type_orderGet(j)) > 0) && continue_flag )
                        continue_flag = AddItemToContainer(solution, container_id, solution.item_type_orderGet(j), 2, true);

                    // put the remaining items in the unpacked items list

                    solution.unpacked_item_count[solution.item_type_orderGet(j)] = solution.unpacked_item_countGet(solution.item_type_orderGet(j)) + container.repack_item_countGet(solution.item_type_orderGet(j));
                    container.repack_item_count[solution.item_type_orderGet(j)] = 0;
                }
            }
        }
    }
    
    // change the preferred rotation order randomly
    
    for( i = 1; i <= item_list.num_item_types; i++ ){
        
        for( j = 1; j <= 6; j++ ){
            k = Math.floor((6 - j + 1) * Math.random() + j); // the order to swap with
            
            swap_long = solution.rotation_order[i][j];
            solution.rotation_order[i][j] = solution.rotation_order[i][k];
            solution.rotation_order[i][k] = swap_long;
        }
        // MsgBox ("Item type " + i + " rotation order: " + solution.rotation_order(i, 1) + solution.rotation_order(i, 2) + solution.rotation_order(i, 3) + solution.rotation_order(i, 4) + solution.rotation_order(i, 5) + solution.rotation_order(i, 6))
    }
    
    // change the item order randomly - test

    for( i = 1; i<= item_list.num_item_types; i++){
        j = Math.floor((item_list.num_item_types - i + 1) * Math.random() + i) // the order to swap with

        swap_long = solution.item_type_orderGet(i);
        solution.item_type_order[i] = solution.item_type_orderGet(j);
        solution.item_type_order[j] = swap_long;
    }
}

/**
 * 
 * @param {solution_data} solution 
 * @param {Number} container_index 
 * @param {Number} item_type_index 
 * @param {Number} add_type 
 * @param {Boolean} item_cohesion 
 */
function AddItemToContainer(solution, container_index, item_type_index, add_type, item_cohesion){
    
    var i = 0;
    var j = 0;

    var rotation_index = 0;

    var origin_x = 0;
    var origin_y = 0;
    var origin_z = 0;
    var opposite_x = 0;
    var opposite_y = 0;
    var opposite_z = 0;

    var min_x = 0;
    var min_y = 0;
    var min_z = 0;
    var next_to_item_type = 0;

    var candidate_position = 0;
    var current_rotation = 0;
    var candidate_rotation = 0;

    var area_supported = 0;
    var area_required = 0;
    var intersection_right = 0;
    var intersection_left = 0;
    var intersection_top = 0;
    var intersection_bottom = 0;
    var support_flag = false;
    
    //With solution.containerGet(container_index)
    var container = solution.containerGet(container_index);
    
    min_x = container.width + 1;
    min_y = container.height + 1;
    min_z = container.length + 1;
    next_to_item_type = 0;
    
    candidate_position = 0;

    var GoTo = false;
    // compatibility check
    if( !GoTo && instance.container_item_compatibility_worksheet === true ){
        if( compatibility_list.container_to_itemGet(container.type_id, item_list.item_typesGet(item_type_index).id) === false )
            GoTo = true; //'AddItemToContainer_Finish';
    }
    
    // volume size check
    if( !GoTo && container.volume_packed + item_list.item_typesGet(item_type_index).volume > container.volume_capacity )
        GoTo = true; //'AddItemToContainer_Finish';
    
    // weight capacity check
    if( !GoTo && container.weight_packed + item_list.item_typesGet(item_type_index).weight > container.weight_capacity )
        GoTo = true; //'AddItemToContainer_Finish';
    
    // item to item compatibility check
    if( !GoTo && instance.item_item_compatibility_worksheet === true ){
        for( i = 1; i <= container.item_cnt; i++ ){
            if( compatibility_list.item_to_itemGet(item_list.item_typesGet(item_type_index).id, item_list.item_typesGet(container.itemsGet(i).item_type).id) === false ){
                GoTo = true; //'AddItemToContainer_Finish';
                break;
            }
        }
    }

    if( !GoTo ){
        for( rotation_index = 1; rotation_index <= 6; rotation_index++ ){
            current_rotation = solution.rotation_order[item_type_index][rotation_index];

            // forbidden rotations
            if( ((current_rotation === 3) || (current_rotation === 4)) && (item_list.item_typesGet(item_type_index).xy_rotatable === false) ){
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if( ((current_rotation === 5) || (current_rotation === 6)) && (item_list.item_typesGet(item_type_index).yz_rotatable === false) ){
                //GoTo  = 'next_rotation_iteration';
                continue;
            }

            // symmetry breaking

            if( (current_rotation === 2) && (Math.abs(item_list.item_typesGet(item_type_index).width - item_list.item_typesGet(item_type_index).length) < epsilon) ){
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if( (current_rotation === 4) && (Math.abs(item_list.item_typesGet(item_type_index).width - item_list.item_typesGet(item_type_index).height) < epsilon) ){
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if( (current_rotation === 6) && (Math.abs(item_list.item_typesGet(item_type_index).height - item_list.item_typesGet(item_type_index).length) < epsilon) ){
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            for( i = 1; i <= container.addition_point_count; i++ ){

                if( (item_cohesion === true) && (candidate_position != 0) && (next_to_item_type === item_type_index) && (container.addition_pointsGet(i).next_to_item_type != item_type_index) ){
                    //GoTo = 'next_iteration';
                    continue;
                }
                
                origin_x = container.addition_pointsGet(i).origin_x;
                origin_y = container.addition_pointsGet(i).origin_y;
                origin_z = container.addition_pointsGet(i).origin_z;
                
                if( current_rotation === 1 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).width;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).height;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).length;
                } else if ( current_rotation === 2 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).length;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).height;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).width;
                } else if ( current_rotation === 3 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).width;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).length;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).height;
                } else if ( current_rotation === 4 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).height;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).length;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).width;
                } else if ( current_rotation === 5 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).height;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).width;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).length;
                } else if ( current_rotation === 6 ){
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).length;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).width;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).height;
                }

                // check the feasibility of all four corners, w.r.t to the other items

                if( (opposite_x > container.width + epsilon) || (opposite_y > container.height + epsilon) || (opposite_z > container.length + epsilon) ){
                    //GoTo = 'next_iteration';
                    continue;
                } 
                
                let next_iteration = false;
                for( j = 1; j <= container.item_cnt; j++){

                    if( (opposite_x < container.itemsGet(j).origin_x + epsilon) ||
                        (container.itemsGet(j).opposite_x < origin_x + epsilon) ||
                        (opposite_y < container.itemsGet(j).origin_y + epsilon) ||
                        (container.itemsGet(j).opposite_y < origin_y + epsilon) ||
                        (opposite_z < container.itemsGet(j).origin_z + epsilon) ||
                        (container.itemsGet(j).opposite_z < origin_z + epsilon) ){
                        // no conflict
                    } else {
                        // conflict
                        //GoTo = 'next_iteration';
                        next_iteration = true;
                        break;
                    }
                }

                if( next_iteration ){
                    continue;
                }

                // vertical support

                if( origin_y < epsilon ){
                    support_flag = true;
                } else {
                    area_supported = 0;
                    area_required = ((opposite_x - origin_x) * (opposite_z - origin_z));
                    support_flag = false;
                    for( j = container.item_cnt; j >= 1; j-- ){
                        if( (Math.abs(origin_y - container.itemsGet(j).opposite_y) < epsilon) ){
                            // check for intersection

                            intersection_right = opposite_x;
                            if( intersection_right > container.itemsGet(j).opposite_x ) intersection_right = container.itemsGet(j).opposite_x;
                            
                            intersection_left = origin_x;
                            if( intersection_left < container.itemsGet(j).origin_x ) intersection_left = container.itemsGet(j).origin_x;
                            
                            intersection_top = opposite_z;
                            if( intersection_top > container.itemsGet(j).opposite_z ) intersection_top = container.itemsGet(j).opposite_z;
                            
                            intersection_bottom = origin_z;
                            if( intersection_bottom < container.itemsGet(j).origin_z ) intersection_bottom = container.itemsGet(j).origin_z;
                            
                            if( (intersection_right > intersection_left) && (intersection_top > intersection_bottom) ){
                                area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                if( area_supported > area_required - epsilon ){
                                    support_flag = true;
                                    break;
                                }
                            }

                        }
                    }

                }

                if( support_flag === false ){ 
                    //GoTo = 'next_iteration';
                    continue;
                }
                
                // side support

                if( instance.front_side_support === true ){
                    if( origin_z < epsilon ){
                        support_flag = true;
                    } else {
                        area_supported = 0;
                        area_required = ((opposite_x - origin_x) * (opposite_y - origin_y));
                        support_flag = false;
                        for( j = container.item_cnt; j >= 1; j-- ){
                            if( (Math.abs(origin_z - container.itemsGet(j).opposite_z) < epsilon) ){
                                // check for intersection
                            
                                intersection_right = opposite_x;
                                if( intersection_right > container.itemsGet(j).opposite_x ) intersection_right = container.itemsGet(j).opposite_x;
                                
                                intersection_left = origin_x;
                                if( intersection_left < container.itemsGet(j).origin_x ) intersection_left = container.itemsGet(j).origin_x;
                                
                                intersection_top = opposite_y;
                                if( intersection_top > container.itemsGet(j).opposite_y ) intersection_top = container.itemsGet(j).opposite_y;
                                
                                intersection_bottom = origin_y;
                                if( intersection_bottom < container.itemsGet(j).origin_y ) intersection_bottom = container.itemsGet(j).origin_y;
                                
                                if( (intersection_right > intersection_left) && (intersection_top > intersection_bottom) ){
                                    area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                    if( area_supported > area_required - epsilon ){
                                        support_flag = true;
                                        break;
                                    }
                                }
                            
                            }
                        }
                    
                    }
                }

                if( support_flag === false ){
                    //GoTo = 'next_iteration';
                    continue;
                }
                
                // no conflicts at this point
                
                if( (item_cohesion === true) && (next_to_item_type != item_type_index) && (container.addition_pointsGet(i).next_to_item_type === item_type_index) ){
                   min_x = origin_x;
                   min_y = origin_y;
                   min_z = origin_z;
                   candidate_position = i;
                   candidate_rotation = current_rotation;
                   next_to_item_type = container.addition_pointsGet(i).next_to_item_type;
                } else {
                    if( (origin_z < min_z) ||
                      ((origin_z <= min_z + epsilon) && (origin_y < min_y)) ||
                      ((origin_z <= min_z + epsilon) && (origin_y <= min_y + epsilon) && (origin_x < min_x)) ||
                      ((origin_z <= min_z + epsilon) && (origin_y <= min_y + epsilon) && (origin_x <= min_x + epsilon) && ((opposite_x > container.width + epsilon) || (opposite_y > container.height + epsilon))) ){
                       min_x = origin_x;
                       min_y = origin_y;
                       min_z = origin_z;
                       candidate_position = i;
                       candidate_rotation = current_rotation;
                       next_to_item_type = container.addition_pointsGet(i).next_to_item_type;
                    }
                }
            }
        }
    }

// next_iteration: Next i
// next_rotation_iteration: Next rotation_index
    
// AddItemToContainer_Finish:

    if( candidate_position === 0 ){
        return false;
    } else {
        //With solution.containerGet(container_index)
        let container = solution.containerGet(container_index);
            container.item_cnt = container.item_cnt + 1;
            container.itemsGet(container.item_cnt).item_type = item_type_index;
            container.itemsGet(container.item_cnt).origin_x = container.addition_pointsGet(candidate_position).origin_x;
            container.itemsGet(container.item_cnt).origin_y = container.addition_pointsGet(candidate_position).origin_y;
            container.itemsGet(container.item_cnt).origin_z = container.addition_pointsGet(candidate_position).origin_z;
            container.itemsGet(container.item_cnt).rotation = candidate_rotation;
            container.itemsGet(container.item_cnt).mandatory = item_list.item_typesGet(item_type_index).mandatory;
            
            if( candidate_rotation === 1 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).width;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).height;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).length;
            } else if ( candidate_rotation === 2 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).length;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).height;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).width;
            } else if ( candidate_rotation === 3 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).width;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).length;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).height;
            } else if ( candidate_rotation === 4 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).height;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).length;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).width;
            } else if ( candidate_rotation === 5 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).height;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).width;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).length;
            } else if ( candidate_rotation === 6 ){
                container.itemsGet(container.item_cnt).opposite_x = container.itemsGet(container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).length;
                container.itemsGet(container.item_cnt).opposite_y = container.itemsGet(container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).width;
                container.itemsGet(container.item_cnt).opposite_z = container.itemsGet(container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).height;
            }
            
            container.volume_packed = container.volume_packed + item_list.item_typesGet(item_type_index).volume;
            container.weight_packed = container.weight_packed + item_list.item_typesGet(item_type_index).weight;

            if( add_type === 2 ){
                container.repack_item_count[item_type_index] = container.repack_item_countGet(item_type_index) - 1;
            }
            
            // update the addition points
            
            for( i = candidate_position; i <= container.addition_point_count - 1; i++){
                container.addition_points[i] = container.addition_pointsGet(i + 1);
            }
            
            container.addition_point_count = container.addition_point_count - 1;
            
            if( (container.itemsGet(container.item_cnt).opposite_x < container.width - epsilon) && (container.itemsGet(container.item_cnt).origin_y < container.height - epsilon) && (container.itemsGet(container.item_cnt).origin_z < container.length - epsilon) ){
                container.addition_point_count = container.addition_point_count + 1;
                container.addition_pointsGet( container.addition_point_count).origin_x = container.itemsGet(container.item_cnt).opposite_x;
                container.addition_pointsGet( container.addition_point_count).origin_y = container.itemsGet(container.item_cnt).origin_y;
                container.addition_pointsGet( container.addition_point_count).origin_z = container.itemsGet(container.item_cnt).origin_z;
                container.addition_pointsGet( container.addition_point_count).next_to_item_type = item_type_index;
            }
            
            if( (container.itemsGet(container.item_cnt).origin_x < container.width - epsilon) && (container.itemsGet(container.item_cnt).opposite_y < container.height - epsilon) && (container.itemsGet(container.item_cnt).origin_z < container.length - epsilon) ){
                container.addition_point_count = container.addition_point_count + 1;
                container.addition_pointsGet( container.addition_point_count).origin_x = container.itemsGet(container.item_cnt).origin_x;
                container.addition_pointsGet( container.addition_point_count).origin_y = container.itemsGet(container.item_cnt).opposite_y;
                container.addition_pointsGet( container.addition_point_count).origin_z = container.itemsGet(container.item_cnt).origin_z;
                container.addition_pointsGet( container.addition_point_count).next_to_item_type = item_type_index;
            }
            
            if( (container.itemsGet(container.item_cnt).origin_x < container.width - epsilon) && (container.itemsGet(container.item_cnt).origin_y < container.height - epsilon) && (container.itemsGet(container.item_cnt).opposite_z < container.length - epsilon) ){
                container.addition_point_count = container.addition_point_count + 1;
                container.addition_pointsGet( container.addition_point_count).origin_x = container.itemsGet(container.item_cnt).origin_x;
                container.addition_pointsGet( container.addition_point_count).origin_y = container.itemsGet(container.item_cnt).origin_y;
                container.addition_pointsGet( container.addition_point_count).origin_z = container.itemsGet(container.item_cnt).opposite_z;
                container.addition_pointsGet( container.addition_point_count).next_to_item_type = item_type_index     ;    
            }
            
        
        //With solution
            // update the profit
            
            if( solution.containerGet(container_index).item_cnt === 1 ){
                solution.net_profit = solution.net_profit + item_list.item_typesGet(item_type_index).profit - solution.containerGet(container_index).cost;
            } else {
                solution.net_profit = solution.net_profit + item_list.item_typesGet(item_type_index).profit;
            }
            
            // update the volume per container and the total volume
            
            solution.total_volume = solution.total_volume + item_list.item_typesGet(item_type_index).volume;
            solution.total_weight = solution.total_weight + item_list.item_typesGet(item_type_index).weight;
            
            // update the unpacked items
            
            if( add_type === 1 ){
                solution.unpacked_item_count[item_type_index] = solution.unpacked_item_countGet(item_type_index) - 1;
            }
        
        return true;
    }

    return false;
    
}

/**
 * @typedef SolverOptions
 * @property {Number} itemSortCriterion - 1:Volume, 2:Weight, 3:MaxDim
 * @property {Boolean} showProgress
 * @property {Number} cpuTimeLimit - in seconds
 * 
 * @param {SolverOptions} options 
 */
function GetSolverOptions(options){
    if(options){
        solver_options.item_sort_criterion = options.itemSortCriterion;
        solver_options.show_progress = options.showProgress;
        solver_options.CPU_time_limit = options.cpuTimeLimit;
    }
    else{
        ThisWorkbook.Worksheets("CLP Solver Console").Activate;
        
        //With solver_options
            
        if( Cells(12, 3).Value === "Volume" ){
            solver_options.item_sort_criterion = 1;
        } else if ( Cells(12, 3).Value === "Weight" ){
            solver_options.item_sort_criterion = 2;
        } else {
            solver_options.item_sort_criterion = 3;
        }
        
        if( Cells(13, 3).Value === "Yes" ){
            solver_options.show_progress = true;
        } else {
            solver_options.show_progress = false;
        }
        
        solver_options.CPU_time_limit = Cells(14, 3).Value;
    }
}

/**
 * @typedef ItemData
 * @property {Number} length
 * @property {Number} width
 * @property {Number} height
 * @property {Boolean} xyRotatable
 * @property {Boolean} yzRotatable
 * @property {Number} weight
 * @property {Number} mandatory
 * @property {Number} profit
 * @property {Number} quantity
 * 
 * @param {Array<ItemData>} itemsData 
 */
function GetItemData(itemsData){

    var numItemTypes;

    if(itemsData){
        numItemTypes = itemsData.length;
    }
    else{
        numItemTypes = ThisWorkbook.Worksheets("CLP Solver Console").Cells(2, 3).Value;
        ThisWorkbook.Worksheets("1.Items").Activate;
    }
    item_list.num_item_types = numItemTypes;
    item_list.total_number_of_items = 0;
    
    item_list.item_types = [null];
    var i = 0;
    for(i = 1; i <= item_list.num_item_types; i++){
        item_list.item_types.push(new item_type_data());
    }
    
    var max_volume = 0;
    var max_weight = 0;
    
    if(itemsData){
        if(itemsData[0] !== null) itemsData.unshift(null);
        for( i = 1; i <= item_list.num_item_types; i++){
            let item = itemsData[i];
            item_list.item_typesGet(i).id = i;
            
            item_list.item_typesGet(i).width = item.width;
            item_list.item_typesGet(i).height = item.height;
            item_list.item_typesGet(i).length = item.length;
            
            item_list.item_typesGet(i).volume = item.width * item.height * item.length;
            
            if( max_volume < item_list.item_typesGet(i).volume ){
                max_volume = item_list.item_typesGet(i).volume;
            }
            
            item_list.item_typesGet(i).xy_rotatable = item.xyRotatable;
            item_list.item_typesGet(i).yz_rotatable = item.yzRotatable;
            
            if( (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).height) < epsilon) && (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).length) < epsilon) ){
                item_list.item_typesGet(i).xy_rotatable = false;
                item_list.item_typesGet(i).yz_rotatable = false;
            }
            
            item_list.item_typesGet(i).weight = item.weight;
            
            if( max_weight < item_list.item_typesGet(i).weight ){
                max_weight = item_list.item_typesGet(i).weight;
            }
            
            item_list.item_typesGet(i).mandatory = item.mandatory;
            
            item_list.item_typesGet(i).profit = item.profit;
            
            item_list.item_typesGet(i).number_requested = item.quantity;
            
            item_list.total_number_of_items = item_list.total_number_of_items + item_list.item_typesGet(i).number_requested;
        
        }
    }
    else{
        //With item_list
        for( i = 1; i <= item_list.num_item_types; i++){
            item_list.item_typesGet(i).id = i;
            
            item_list.item_typesGet(i).width = Cells(2 + i, 4).Value;
            item_list.item_typesGet(i).height = Cells(2 + i, 5).Value;
            item_list.item_typesGet(i).length = Cells(2 + i, 6).Value;
            
            item_list.item_typesGet(i).volume = Cells(2 + i, 7).Value;
            
            if( max_volume < item_list.item_typesGet(i).volume ){
                max_volume = item_list.item_typesGet(i).volume;
            }
            
            if( Cells(2 + i, 9).Value === "Yes" ){
                item_list.item_typesGet(i).xy_rotatable = true;
            } else {
                item_list.item_typesGet(i).xy_rotatable = false;
            }
            
            if( Cells(2 + i, 10).Value === "Yes" ){
                item_list.item_typesGet(i).yz_rotatable = true;
            } else {
                item_list.item_typesGet(i).yz_rotatable = false;
            }
            
            if( (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).height) < epsilon) && (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).length) < epsilon) ){
                item_list.item_typesGet(i).xy_rotatable = false;
                item_list.item_typesGet(i).yz_rotatable = false;
            }
            
            item_list.item_typesGet(i).weight = Cells(2 + i, 11).Value;
            
            if( max_weight < item_list.item_typesGet(i).weight ){
                max_weight = item_list.item_typesGet(i).weight;
            }
            
            if( Cells(2 + i, 12).Value === "Must be packed" ){
                item_list.item_typesGet(i).mandatory = 1;
            } else if ( Cells(2 + i, 12).Value === "May be packed" ){
                item_list.item_typesGet(i).mandatory = 0;
            } else if ( Cells(2 + i, 12).Value === "Don't pack" ){
                item_list.item_typesGet(i).mandatory = -1;
            }
            
            item_list.item_typesGet(i).profit = Cells(2 + i, 13).Value;
            
            item_list.item_typesGet(i).number_requested = Cells(2 + i, 14).Value;
            
            item_list.total_number_of_items = item_list.total_number_of_items + item_list.item_typesGet(i).number_requested;
        
        }
    }
    
    for( i = 1; i <= item_list.num_item_types; i++){
    
        if( solver_options.item_sort_criterion === 1 ){
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).volume * (max_weight + 1) + item_list.item_typesGet(i).weight;
        } else if ( solver_options.item_sort_criterion === 2 ){
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).weight * (max_volume + 1) + item_list.item_typesGet(i).volume;
        } else {
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).width;
            if( item_list.item_typesGet(i).sort_criterion < item_list.item_typesGet(i).height ){
                item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).height;
            }
            if( item_list.item_typesGet(i).sort_criterion < item_list.item_typesGet(i).length ){
                item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).length;
            }
            
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).sort_criterion * (max_volume + 1) + item_list.item_typesGet(i).volume;
        }
    }
    
}


/**
 * @typedef ContainerData
 * @property {Number} length
 * @property {Number} width
 * @property {Number} height
 * @property {Number} weightCapacity
 * @property {Number} mandatory
 * @property {Number} cost
 * @property {Number} quantity
 * 
 * @param {Array<ContainerData>} containersData 
 */
function GetContainerData(containersData){

    var numContainerTypes;
    if(containersData){
        numContainerTypes = containersData.length;
    }
    else{
        numContainerTypes = ThisWorkbook.Worksheets("CLP Solver Console").Cells(4, 3).Value;
        ThisWorkbook.Worksheets("2.Containers").Activate;
    }

    container_list.num_container_types = numContainerTypes;
    
    container_list.container_types = [null];
    var i = 0;
    for(i = 1; i <= container_list.num_container_types; i++){
        container_list.container_types.push(new container_type_data());
    }
    
    if(containersData){
        containersData.unshift(null);
        for( i = 1; i <= container_list.num_container_types; i++){
            let container = containersData[i];
            
            container_list.container_typesGet(i).type_id = i;
            
            container_list.container_typesGet(i).width = container.width;
            container_list.container_typesGet(i).height = container.height;
            container_list.container_typesGet(i).length = container.length;
            
            container_list.container_typesGet(i).volume_capacity = container.width * container.height * container.length;
            container_list.container_typesGet(i).weight_capacity = container.weightCapacity;
            
            container_list.container_typesGet(i).mandatory = container.mandatory;
            
            container_list.container_typesGet(i).cost = container.cost;
            
            container_list.container_typesGet(i).number_available = container.quantity;
        }
    }
    else{
        //With container_list
        for( i = 1; i <= container_list.num_container_types; i++){
            
            container_list.container_typesGet(i).type_id = i;
            
            container_list.container_typesGet(i).width = Cells(1 + i, 3).Value;
            container_list.container_typesGet(i).height = Cells(1 + i, 4).Value;
            container_list.container_typesGet(i).length = Cells(1 + i, 5).Value;
            
            container_list.container_typesGet(i).volume_capacity = Cells(1 + i, 6).Value;
            container_list.container_typesGet(i).weight_capacity = Cells(1 + i, 7).Value;
            
            if( Cells(1 + i, 8).Value === "Must be used" ){
                container_list.container_typesGet(i).mandatory = 1;
            } else if ( Cells(1 + i, 8).Value === "May be used" ){
                container_list.container_typesGet(i).mandatory = 0;
            } else if ( Cells(1 + i, 8).Value === "Do not use" ){
                container_list.container_typesGet(i).mandatory = -1;
            }
            
            container_list.container_typesGet(i).cost = Cells(1 + i, 9).Value;
            
            container_list.container_typesGet(i).number_available = Cells(1 + i, 10).Value;
        
        }
    }
}


function GetCompatibilityData(){

    /*
    
    //With compatibility_list
        
    var i = 0;
    var j = 0;
    var k = 0;

    if( instance.item_item_compatibility_worksheet === true ){
    
        compatibility_list.item_to_item = [[]];
        
        for( i = 1; i <= item_list.num_item_types; i++) {
            for( j = 1; j <= item_list.num_item_types; j++ ){
                item_list.item_to_item[i][j] = true;
            }
        }
        
        k = 3;
        for( i = 1; i <= item_list.num_item_types; i++){
            for( j = i + 1; j <= item_list.num_item_types; j++){
                if( ThisWorkbook.Worksheets("1.3.Item-Item Compatibility").Cells(k, 3) === "No" ){
                    item_list.item_to_item[i][j] = false;
                    item_list.item_to_item[j][i] = false;
                }
                k = k + 1;
            }
        }
        
    }
    
    if( instance.container_item_compatibility_worksheet = true ){
    
        Re var .container_to_itemGet(1; <=container_list.num_container_types, 1; <=item_list.num_item_types)
        
        for( i = 1; <=container_list.num_container_types
            for( j = 1; <=item_list.num_item_types
            
                .container_to_itemGet(i, j) = true
                
            }
        }
        
        k = 3
        for( i = 1; <=container_list.num_container_types
            for( j = 1; <=item_list.num_item_types
            
                if( ThisWorkbook.Worksheets("2.3.Container-ItemCompatibility").Cells(k, 3) = "No" ){
                    .container_to_itemGet(i, j) = false
                }
                    
                k = k + 1
            }
        }
        
    }
    */
}

/**
 * 
 * @param {solution_data} solution 
 */
function InitializeSolution(solution){
    
     var i = 0;
     var j = 0;
     var k = 0;
     var l = 0;
    
    //With solution
    solution.feasible = false;
    solution.net_profit = 0;
    solution.total_volume = 0;
    solution.total_weight = 0;
    solution.total_distance = 0;
    solution.total_x_moment = 0;
    solution.total_yz_moment = 0;
    
    solution.num_containers = 0;
    for( i = 1; i <= container_list.num_container_types; i++){
        if( container_list.container_typesGet(i).mandatory >= 0 ){
            solution.num_containers = solution.num_containers + container_list.container_typesGet(i).number_available;
        }
    }
    
    solution.rotation_order = [null];
    for( i = 1; i <= item_list.num_item_types; i++){
        solution.rotation_order[i] = [null];
        for( j = 1; j<=6; j++){
           solution.rotation_order[i][j] = j;
        }
    }
    
    solution.item_type_order = [null];
    for( i = 1; i<=item_list.num_item_types; i++){
       solution.item_type_order[i] = i;
    }
    
    solution.container = [null];
    for( i = 1; i <= solution.num_containers; i++){
        solution.container[i] = new container_data();

        solution.containerGet(i).items = [null];
        for(j = 1; j <= item_list.total_number_of_items; j++)
            solution.containerGet(i).items.push(new item_in_container());

        solution.containerGet(i).addition_points = [null];
        for(j = 1; j <= 3 * item_list.total_number_of_items; j++)
            solution.containerGet(i).addition_points.push(new item_location());

        solution.containerGet(i).repack_item_count = [null];
        for(j = 1; j <= item_list.total_number_of_items; j++)
            solution.containerGet(i).repack_item_count.push(0);
    }
    
    solution.unpacked_item_count = [null];
    
    l = 1;
    for( i = 1; i<=container_list.num_container_types; i++){
        if( container_list.container_typesGet(i).mandatory >= 0 ){
            for( j = 1; j<=container_list.container_typesGet(i).number_available; j++){
                
               solution.containerGet(l).width = container_list.container_typesGet(i).width;
               solution.containerGet(l).height = container_list.container_typesGet(i).height;
               solution.containerGet(l).length = container_list.container_typesGet(i).length;
               solution.containerGet(l).volume_capacity = container_list.container_typesGet(i).volume_capacity;
               solution.containerGet(l).weight_capacity = container_list.container_typesGet(i).weight_capacity;
               solution.containerGet(l).cost = container_list.container_typesGet(i).cost;
               solution.containerGet(l).mandatory = container_list.container_typesGet(i).mandatory;
               solution.containerGet(l).type_id = i;
               solution.containerGet(l).volume_packed = 0;
               solution.containerGet(l).weight_packed = 0;
               solution.containerGet(l).item_cnt = 0;
                
               solution.containerGet(l).addition_point_count = 1;
                
                for( k = 1; k<=item_list.total_number_of_items; k++){
                   solution.containerGet(l).itemsGet(k).item_type = 0;
                   solution.containerGet(l).addition_pointsGet(k).origin_x = 0;
                   solution.containerGet(l).addition_pointsGet(k).origin_y = 0;
                   solution.containerGet(l).addition_pointsGet(k).origin_z = 0;
                   solution.containerGet(l).addition_pointsGet(k).next_to_item_type = 0;
                }
                
                for( k = 1; k<=item_list.total_number_of_items; k++){
                   solution.containerGet(l).repack_item_count[k] = 0;
                }
                
                l = l + 1;
            }
        }
    }
    
    for( i = 1; i<=item_list.num_item_types; i++){
       solution.unpacked_item_count[i] = item_list.item_typesGet(i).number_requested;
    }
        
}

function GetInstanceData(){
    
    if( ThisWorkbook.Worksheets("CLP Solver Console").Cells(6, 3).Value === "Yes" ){
        instance.front_side_support = true;
    } else {
        instance.front_side_support = false;
    }
    
    if( CheckWorksheetExistence("1.3.Item-Item Compatibility") === true ){
        instance.item_item_compatibility_worksheet = true;
    } else {
        instance.item_item_compatibility_worksheet = false;
    }
        
    if( CheckWorksheetExistence("2.3.Container-ItemCompatibility") === true ){
        instance.container_item_compatibility_worksheet = true;
    } else {
        instance.container_item_compatibility_worksheet = false;
    }
    
}

/**
 * @param {solution_data} solution 
 */
function WriteSolution(solution){

    //Application.ScreenUpdating = False
    //Application.Calculation = xlCalculationManual
            
    var i = 0;
    var j = 0;
    var k = 0;

    var container_index = 0;

    /** @type {container_data} */
    var swap_container;
    
    // sort the containers
    
    for( i = 1; i<=solution.num_containers; i++){
        for( j = solution.num_containers; j >= 2; j--){
            if( (solution.containerGet(j).type_id < solution.containerGet(j - 1).type_id) ||
                ((solution.containerGet(j).type_id === solution.containerGet(j - 1).type_id) && (solution.containerGet(j).volume_packed > solution.containerGet(j - 1).volume_packed)) ){
                swap_container = solution.containerGet(j);
                solution.container[j] = solution.containerGet(j - 1);
                solution.container[j - 1] = swap_container;
            }
        }
    }
    
    ThisWorkbook.Worksheets("3.Solution").Activate;

    if( solution.feasible === false ){
        Cells(2, 1).Value = "Warning: Last solution returned by the solver does not satisfy all constraints.";
        //Range(Cells(2, 1), Cells(2, 10)).Interior.ColorIndex = 45;
    } else {
        Cells(2, 1).Value = 0;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.Pattern = xlNone;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.TintAndShade = 0;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.PatternTintAndShade = 0;
    }
    
    var offset = 0;
    
    offset = 0;
    container_index = 1;
    
    //With solution
    
    for( i = 1; i<=container_list.num_container_types; i++){
    
        for( j = 1; j<=container_list.container_typesGet(i).number_available; j++){

            Range(Cells(6, offset + 2), Cells(5 + 2 * item_list.total_number_of_items, offset + 2)).Value = 0;
            Range(Cells(6, offset + 3), Cells(5 + 2 * item_list.total_number_of_items, offset + 5)).ClearContents;
            Range(Cells(6, offset + 6), Cells(5 + 2 * item_list.total_number_of_items, offset + 6)).Value = 0;
            
            if( container_list.container_typesGet(i).mandatory >= 0 ){
                Cells(3, 'B', solution.containerGet(container_index).item_cnt);
                for( k = 1; k <= solution.containerGet(container_index).item_cnt; k++){
                    Cells(5 + k, offset + 2).Value = ThisWorkbook.Worksheets("1.Items").Cells(2 + item_list.item_typesGet(solution.containerGet(container_index).itemsGet(k).item_type).id, 2).Value;
                    Cells(5 + k, offset + 3).Value = solution.containerGet(container_index).itemsGet(k).origin_x;
                    Cells(5 + k, offset + 4).Value = solution.containerGet(container_index).itemsGet(k).origin_y;
                    Cells(5 + k, offset + 5).Value = solution.containerGet(container_index).itemsGet(k).origin_z;
                    if(solution.containerGet(container_index).itemsGet(k).rotation === 1 ){
                        Cells(5 + k, offset + 6).Value = "xyz";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 2 ){
                        Cells(5 + k, offset + 6).Value = "zyx";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 3 ){
                        Cells(5 + k, offset + 6).Value = "xzy";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 4 ){
                        Cells(5 + k, offset + 6).Value = "yzx";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 5 ){
                        Cells(5 + k, offset + 6).Value = "yxz";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 6 ){
                        Cells(5 + k, offset + 6).Value = "zxy";
                    }
                }
                    
                container_index = container_index + 1;
            }
            
            offset = offset + 11;
        }
    }

    signaler.Dispatch(signals.solution, solution);
    
    //Application.ScreenUpdating = true
    //Application.Calculation = xlCalculationAutomatic
}

/**
 * 
 * @param {Array<SolverOptions>} solverOptions 
 * @param {Array<ItemData>} itemsData 
 * @param {Array<ContainerData>} containersData 
 */
function CLP_Solver(solverOptions, itemsData, containersData){

    //Application.ScreenUpdating = false
    //Application.Calculation = xlCalculationManual
    
    var WorksheetExists = false;
    var reply = 0;

    GetSolverOptions(solverOptions);
    
    WorksheetExists = CheckWorksheetExistence("1.Items") && CheckWorksheetExistence("2.Containers") && CheckWorksheetExistence("3.Solution");
    if( (!solverOptions || !itemsData || !containersData) && WorksheetExists === false ){
        Application.Alert("Worksheets 1.Items, 2.Containers, and 3.Solution must exist for the CLP Spreadsheet Solver to function.");
        //Application.ScreenUpdating = true
        //Application.Calculation = xlCalculationAutomatic
        return;
    } else {
        reply = Application.Confirm("This will take " + solver_options.CPU_time_limit + " seconds. Do you want to continue?", true);//, vbYesNo, "CLP Spreadsheet Solver")
        if( reply === false ){
            //Application.ScreenUpdating = true
            //Application.Calculation = xlCalculationAutomatic
            return;
        }
    }
    
    //Application.EnableCancelKey = xlErrorHandler
    //On Error GoTo CLP_Solver_Finish
    
    // Allocate memory and get the data
    
    GetItemData(itemsData);
    GetContainerData(containersData);
    //GetInstanceData();
    //GetCompatibilityData();
    SortItems();
    
    var incumbent = new solution_data();
    InitializeSolution(incumbent);
    
    var best_known = new solution_data();
    InitializeSolution(best_known);
    best_known = incumbent;
    
    var iteration = 0;

    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;

    var nonempty_container_cnt = 0;
    var container_id = 0;

    var start_time = 0;
    var end_time = 0;

    var continue_flag = false;
    var sort_criterion = 0;
    var selected_rotation = 0;
    
    // infeasibility check    

    var fcData = FeasibilityCheckData();
    var infeasibility_count = fcData.infeasibility_count;
    var infeasibility_string = fcData.infeasibility_string;

    if( infeasibility_count > 0 ){
        reply = Application.Confirm("Infeasibilities detected. " + infeasibility_string + " Do you want to continue?", true);//, vbYesNo, "CLP Spreadsheet Solver")
        if( reply === false ){
            //Application.ScreenUpdating = true
            //Application.Calculation = xlCalculationAutomatic
            return;
        }
    }
    
    start_time = performance.now() / 1000.0;
    end_time = start_time;
        
    // constructive phase
    
    if( solver_options.show_progress === true ){
        Application.ScreenUpdating = true
        Application.StatusBar = "Constructive phase..."
        Application.ScreenUpdating = false
    } else {
        Application.ScreenUpdating = true
        Application.StatusBar = "LNS algorithm running..."
        Application.ScreenUpdating = false
    }
    
    SortContainers(incumbent, 0);
    
    for( i = 1; i <= incumbent.num_containers; i++){
        // sort the rotation order for this container
        for( j = 1; j <= item_list.num_item_types; j++){
            sort_criterion = 0;
            selected_rotation = 0;
            
            if( sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) ){
                sort_criterion = (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height);
                selected_rotation = 1;
            }
            
            if( sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) ){
                sort_criterion = (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height);
                selected_rotation = 2;
            }
            
            if( (item_list.item_typesGet(j).xy_rotatable === true) && (sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length)) ){
                sort_criterion = (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length);
                selected_rotation = 3;
            }
            
            if( (item_list.item_typesGet(j).xy_rotatable === true) && (sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length)) ){
                sort_criterion = sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length);
                selected_rotation = 4;
            }
            
            if( (item_list.item_typesGet(j).yz_rotatable === true) && (sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width)) ){
                sort_criterion = (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width);
                selected_rotation = 5;
            }
            
            if( (item_list.item_typesGet(j).yz_rotatable === true) && (sort_criterion < (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width)) ){
                sort_criterion = (Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length) * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width);
                selected_rotation = 6;
            }
            
            if( selected_rotation === 0 ){
                selected_rotation = 1;
            }
            
            incumbent.rotation_order[j][1] = selected_rotation;
            incumbent.rotation_order[j][selected_rotation] = 1;
        }
        
        for( j = 1; j <= item_list.num_item_types; j++){
        
            continue_flag = true;
            while ( (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0) && continue_flag ){
                continue_flag = AddItemToContainer(incumbent, i, incumbent.item_type_orderGet(j), 1, false);
            }
        }
        
        incumbent.feasible = true;
        for( j = 1; j <= item_list.num_item_types; j++){
            if( (incumbent.unpacked_item_countGet(j) > 0) && (item_list.item_typesGet(j).mandatory === 1) ){
                incumbent.feasible = false;
                break;
            }
        }
        
        CalculateDispersion(incumbent);

        if( ((incumbent.feasible === true) && (best_known.feasible === false)) ||
           ((incumbent.feasible === false) && (best_known.feasible === false) && (incumbent.total_volume > best_known.total_volume + epsilon)) ||
           ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit + epsilon)) ||
           ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume - epsilon)) ){

            best_known = incumbent;
            
        }
        
    }
    
    // GoTo CLP_Solver_Finish

    // end_time = Timer
    // MsgBox "Constructive phase result: " + best_known.net_profit + " time: " + end_time - start_time

    // improvement phase

    iteration = 0;

    //Do
    do {
        //DoEvents
        if( (solver_options.show_progress === true) && (iteration % 100 === 0) ){
            //Application.ScreenUpdating = true
            if( best_known.feasible === true ){
                Application.StatusBar = "Starting iteration " + iteration + ". Best net profit found so far: " + best_known.net_profit + " Dispersion: " + best_known.total_distance;
            } else {
                Application.StatusBar = "Starting iteration " + iteration + ". Best net profit found so far: N/A" + " Dispersion: " + best_known.total_distance;
            }
            Application.ScreenUpdating = false
        }

        if( Math.random() < 0.5 ){ // < ((end_time - start_time) / solver_options.CPU_time_limit) ^ 2 ){

            incumbent = best_known;

        }
        
        //With incumbent
        for( i = 1; i <= incumbent.num_containers; i++){
            PerturbSolution(incumbent, i, 1 - ((end_time - start_time) / solver_options.CPU_time_limit));
        } 
        
        SortContainers(incumbent, 0.2);

        //With incumbent
        for( i = 1; i <= incumbent.num_containers; i++){
            for( j = 1; j <= item_list.num_item_types; j++){
                continue_flag = true;
                while ( (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0) && (continue_flag === true) ){
                    continue_flag = AddItemToContainer(incumbent, i, incumbent.item_type_orderGet(j), 1, false);
                    //DoEvents
                }
            }
    
            incumbent.feasible = true;
            for( j = 1; j <= item_list.num_item_types; j++){
                if( (incumbent.unpacked_item_countGet(j) > 0) && (item_list.item_typesGet(j).mandatory === 1) ){
                    incumbent.feasible = false;
                    break;
                }
            }
            
            CalculateDispersion(incumbent);
            
            if( ((incumbent.feasible === true) && (best_known.feasible === false)) ||
               ((incumbent.feasible === false) && (best_known.feasible === false) && (incumbent.total_volume > best_known.total_volume + epsilon)) ||
               ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit + epsilon)) ||
               ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume - epsilon)) ||
               ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance - epsilon) ||
               ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance + epsilon) && (incumbent.total_x_moment < best_known.total_x_moment - epsilon) ||
               ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance + epsilon) && (incumbent.total_x_moment < best_known.total_x_moment + epsilon) && (incumbent.total_yz_moment < best_known.total_yz_moment - epsilon) ){
    
                best_known = incumbent;
            }
        }

        iteration = iteration + 1;
        
        end_time = performance.now() / 1000.0;
        
        /* WILL NEVER HAPPEN ? chadik
        if( end_time < start_time - 0.01 ){
            solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
            start_time = end_time
        }
        */
        
    }
    while( end_time - start_time < solver_options.CPU_time_limit / 3 );
    
    // reorganize now

    CalculateDistance(best_known);

    nonempty_container_cnt = 0;
    //With best_known
    for( i = 1; i <= best_known.num_containers; i++){
        if( best_known.containerGet(i).item_cnt > 0 ){
            nonempty_container_cnt = nonempty_container_cnt + 1;
        }
    }

    for( container_id = 1; container_id <= best_known.num_containers; container_id++){
        Application.ScreenUpdating = true;
        if( best_known.feasible === true ){
            Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: " + best_known.net_profit + " Distance: " + best_known.total_distance;
        } else {
            Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: N/A" + " Distance: " + best_known.total_distance;
        }
        Application.ScreenUpdating = false;

        if( best_known.containerGet(container_id).item_cnt > 0 ){

            incumbent = best_known;

            start_time = performance.now() / 1000.0;
            end_time = start_time;

            //Do
            do{
                //DoEvents

                PerturbSolution(incumbent, container_id, 0.1 + 0.2 * ((end_time - start_time) / ((solver_options.CPU_time_limit * 0.666) / nonempty_container_cnt)));

                //With incumbent

                    for( j = 1; j <= item_list.num_item_types; j++){
                        continue_flag = true;
                        while( (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0) && (continue_flag === true) ){
                            continue_flag = AddItemToContainer(incumbent, container_id, incumbent.item_type_orderGet(j), 1, true);
                            //DoEvents
                        }
                    }

                incumbent.feasible = true
                for( j = 1; j <= item_list.num_item_types; j++){
                    if( (incumbent.unpacked_item_countGet(j) > 0) && (item_list.item_typesGet(j).mandatory === 1) ){
                        incumbent.feasible = false;
                        break;
                    }
                }

                CalculateDistance(incumbent);

                if( ((incumbent.feasible === true) && (best_known.feasible === false)) ||
                   ((incumbent.feasible === false) && (best_known.feasible === false) && (incumbent.total_volume > best_known.total_volume + epsilon)) ||
                   ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit + epsilon)) ||
                   ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume - epsilon)) ||
                   ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance - epsilon) ||
                   ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance + epsilon) && (incumbent.total_x_moment < best_known.total_x_moment - epsilon) ||
                   ((incumbent.feasible === true) && (best_known.feasible === true) && (incumbent.net_profit > best_known.net_profit - epsilon) && (incumbent.total_volume < best_known.total_volume + epsilon)) && (incumbent.total_distance < best_known.total_distance + epsilon) && (incumbent.total_x_moment < best_known.total_x_moment + epsilon) && (incumbent.total_yz_moment < best_known.total_yz_moment - epsilon) ){
            
                    best_known = incumbent;
                    
                    // if( best_known.feasible = true ){
                    //     Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: " + best_known.net_profit + " Distance: " + best_known.total_distance
                    // } else {
                    //     Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: N/A" + " Distance: " + best_known.total_distance
                    // }
                    
                }

                end_time = performance.now() / 1000.0;
                
                /* WILL NEVER HAPPEN? chadiik
                if( end_time < start_time - 0.01 ){
                    solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
                    start_time = end_time
                }
                */

            }
            while ( end_time - start_time < (solver_options.CPU_time_limit * 0.666) / nonempty_container_cnt );

        }

    }

    // MsgBox "Iterations performed: " + iteration
    
//CLP_Solver_Finish:
    
    // ensure loadability

    var min_x = 0;
    var min_y = 0;
    var min_z = 0;

    var intersection_right = 0;
    var intersection_left = 0;
    var intersection_top = 0;
    var intersection_bottom = 0;

    var selected_item_index = 0;

    /** @type {item_in_container} */
    var swap_item;

    var area_supported = 0;
    var area_required = 0;
    var support_flag = false;

    for( i = 1; i <= best_known.num_containers; i++){
        //With best_known.containerGet(i)
        let container = best_known.containerGet(i);

            for( j = 1; j <= container.item_cnt; j++ ){

                selected_item_index = 0;
                min_x = container.width;
                min_y = container.height;
                min_z = container.length;
                
                for( k = j; k <= container.item_cnt; k++ ){

                    if( (container.itemsGet(k).origin_z < min_z - epsilon) ||
                        ((container.itemsGet(k).origin_z < min_z + epsilon) && (container.itemsGet(k).origin_y < min_y - epsilon)) ||
                        ((container.itemsGet(k).origin_z < min_z + epsilon) && (container.itemsGet(k).origin_y < min_y + epsilon) && (container.itemsGet(k).origin_x < min_x - epsilon)) ){

                        // check for support
                    
                        if( container.itemsGet(k).origin_y < epsilon ){
                            support_flag = true;
                        } else {
                            area_supported = 0;
                            area_required = ((container.itemsGet(k).opposite_x - container.itemsGet(k).origin_x) * (container.itemsGet(k).opposite_z - container.itemsGet(k).origin_z));
                            support_flag = false;
                            for( l = j - 1; l >= 1; l--){
                                        
                                if( (Math.abs(container.itemsGet(k).origin_y - container.itemsGet(l).opposite_y) < epsilon) ){
                                    
                                    // check for intersection
                                    
                                    intersection_right = container.itemsGet(k).opposite_x;
                                    if( intersection_right > container.itemsGet(l).opposite_x ) intersection_right = container.itemsGet(l).opposite_x;

                                    intersection_left = container.itemsGet(k).origin_x;
                                    if( intersection_left < container.itemsGet(l).origin_x ) intersection_left = container.itemsGet(l).origin_x;
                                    
                                    intersection_top = container.itemsGet(k).opposite_z;
                                    if( intersection_top > container.itemsGet(l).opposite_z ) intersection_top = container.itemsGet(l).opposite_z;
                                    
                                    intersection_bottom = container.itemsGet(k).origin_z;
                                    if( intersection_bottom < container.itemsGet(l).origin_z ) intersection_bottom = container.itemsGet(l).origin_z;
                                    
                                    if( (intersection_right > intersection_left) && (intersection_top > intersection_bottom) ){
                                        area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                        if( area_supported > area_required - epsilon ){
                                            support_flag = true;
                                            break;
                                        }
                                    }
                                    
                                }
                            }
                            
                        }
                        
                        if( support_flag === true ){
                            selected_item_index = k;

                            min_x = container.itemsGet(k).origin_x;
                            min_y = container.itemsGet(k).origin_y;
                            min_z = container.itemsGet(k).origin_z;
                        }
                    }
                
                }

                if( selected_item_index > 0 ){
                    swap_item = container.itemsGet(selected_item_index);
                    container.items[selected_item_index] = container.itemsGet(j);
                    container.items[j] = swap_item;
                } else {
                    Application.Alert("Loading order could not be constructed.");
                }
            }
    }
        
    // write the solution
    
    // MsgBox best_known.total_distance
    
    if( best_known.feasible === true ){
        reply = Application.Confirm("CLP Spreadsheet Solver performed " + iteration + " LNS iterations and found a solution with a net profit of " + best_known.net_profit + ". Do you want to overwrite the current solution with the best found solution?", true);//, vbYesNo, "CLP Spreadsheet Solver")
        if( reply ){
            WriteSolution(best_known);
        }
    } else if ( infeasibility_count > 0 ){
        WriteSolution(best_known);
    } else {
        reply = Application.Confirm("The best found solution after " + iteration + " LNS iterations does not satisfy all constraints. Do you want to overwrite the current solution with the best found solution?", true);//, vbYesNo, "CLP Spreadsheet Solver")
        if( reply ){
            WriteSolution(best_known);
        }
    }
    
    // Erase the data
    /*
    delete item_list.item_types;
    delete container_list.container_types;
    delete compatibility_list.item_to_item;
    delete compatibility_list.container_to_item;

    for( i = 1; i <= incumbent.num_containers; i++){
        delete incumbent.containerGet(i).items;
    }
    delete incumbent.container;
    delete incumbent.unpacked_item_count;
    
    if(best_known.container){
        for( i = 1; i <= best_known.container.length; i++){
            if(best_known.container[i])
                delete best_known.containerGet(i).items;
        }
        delete best_known.container;
    }
    delete best_known.unpacked_item_count;
    */
    Application.StatusBar = false;
    Application.ScreenUpdating = true;
    //Application.Calculation = xlCalculationAutomatic
    
    //ThisWorkbook.Worksheets("3.Solution").Activate;
    //Cells(1, 1).Select;
    
}

function FeasibilityCheckData(){
    
    var i = 0;
    var j = 0;
    var feasibility_flag = false;
    
    var infeasibility_count = 0;
    var infeasibility_string = '';
    
    Range(ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 9, 1), ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + (4 * item_list.total_number_of_items), 1)).Clear;
    
    var volume_capacity_required = 0;
    var volume_capacity_available = 0;

    var weight_capacity_required = 0;
    var weight_capacity_available = 0;

    var max_width = 0;
    var max_heigth = 0;
    var max_length = 0;
    
    //With item_list
    for( i = 1; i <= item_list.num_item_types; i++){
        if( item_list.item_typesGet(i).mandatory === 1 ){
            volume_capacity_required = volume_capacity_required + (item_list.item_typesGet(i).volume * item_list.item_typesGet(i).number_requested);
            weight_capacity_required = weight_capacity_required + (item_list.item_typesGet(i).weight * item_list.item_typesGet(i).number_requested);
        }
    }
    
    
    //With container_list
    for( i = 1; i <= container_list.num_container_types; i++){
        if( container_list.container_typesGet(i).mandatory >= 0 ){
            volume_capacity_available = volume_capacity_available + (container_list.container_typesGet(i).volume_capacity * container_list.container_typesGet(i).number_available);
            weight_capacity_available = weight_capacity_available + (container_list.container_typesGet(i).weight_capacity * container_list.container_typesGet(i).number_available);
            
            if( container_list.container_typesGet(i).width > max_width ) max_width = container_list.container_typesGet(i).width;
            if( container_list.container_typesGet(i).height > max_heigth ) max_heigth = container_list.container_typesGet(i).height;
            if( container_list.container_typesGet(i).length > max_length ) max_length = container_list.container_typesGet(i).length;
            
        }
    }
    
    if( volume_capacity_required > volume_capacity_available + epsilon ){
        infeasibility_count = infeasibility_count + 1;
        infeasibility_string = infeasibility_string + "The amount of available volume is not enough to pack the mandatory items.\n";
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available volume is not enough to pack the mandatory items.";
    }
    
    if( weight_capacity_required > weight_capacity_available + epsilon ){
        infeasibility_count = infeasibility_count + 1;
        infeasibility_string = infeasibility_string + "The amount of available weight capacity is not enough to pack the mandatory items.\n";
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available weight capacity is not enough to pack the mandatory items.";
    }
    
    //With item_list
    for( i = 1; i <= item_list.num_item_types; i++){
        //With .item_typesGet(i)
        let itemType = item_list.item_typesGet(i);
        if( (itemType.mandatory === 1) && (itemType.xy_rotatable === false) && (itemType.yz_rotatable === false) && ((itemType.width > max_width + epsilon) || (itemType.height > max_heigth + epsilon) || (itemType.length > max_length + epsilon)) ){
            infeasibility_count = infeasibility_count + 1;
            if( infeasibility_count < 5 ){
                infeasibility_string = infeasibility_string + "Item type " + i + " is too large to fit into any container." + "\n";
            }
            if( infeasibility_count === 5 ){
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too large to fit into any container.";
        }

        if( (itemType.mandatory === 1) && (itemType.width > max_width + epsilon) && (itemType.width > max_heigth + epsilon) && (itemType.width > max_length + epsilon) ){
            infeasibility_count = infeasibility_count + 1;
            if( infeasibility_count < 5 ){
                infeasibility_string = infeasibility_string + "Item type " + i + " is too wide to fit into any container." + "\n";
            }
            if( infeasibility_count === 5 ){
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too wide to fit into any container.";
        }

        if( (itemType.mandatory === 1) && (itemType.height > max_width + epsilon) && (itemType.height > max_heigth + epsilon) && (itemType.height > max_length + epsilon) ){
            infeasibility_count = infeasibility_count + 1;
            if( infeasibility_count < 5 ){
                infeasibility_string = infeasibility_string + "Item type " + i + " is too tall to fit into any container." + "\n";
            }
            if( infeasibility_count === 5 ){
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too tall to fit into any container.";
        }
        
        if( (itemType.mandatory === 1) && (itemType.length > max_width + epsilon) && (itemType.length > max_heigth + epsilon) && (itemType.length > max_length + epsilon) ){
            infeasibility_count = infeasibility_count + 1;
            if( infeasibility_count < 5 ){
                infeasibility_string = infeasibility_string + "Item type " + i + " is too long to fit into any container." + "\n";
            }
            if( infeasibility_count === 5 ){
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too long to fit into any container.";
        }
        
    }
    
    if( instance.container_item_compatibility_worksheet === true ){
    
        for( i = 1; i <= item_list.num_item_types; i++){
            
            feasibility_flag = false;
            
            for( j = 1; j <= container_list.num_container_types; j++){
                if( compatibility_list.container_to_itemGet(j, i) === true ){
                    feasibility_flag = true;
                    break;
                }
            }
            
            if( feasibility_flag === false ){
                
                infeasibility_count = infeasibility_count + 1;
                if( infeasibility_count < 5 ){
                    infeasibility_string = infeasibility_string + "Item type " + i + " is not compatible with any container." + "\n";
                }
                if( infeasibility_count === 5 ){
                    infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
                }
                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is not compatible with any container.";
            }
            
        }
    }
    
    return {
        infeasibility_count: infeasibility_count,
        infeasibility_string: infeasibility_string
    };
}


function SortItems(){

    var i = 0;
    var j = 0;

    /** @type {item_type_data} */
    var swap_item_type;
    
    if( item_list.num_item_types > 1 ){
       for( i = 1; i <= item_list.num_item_types; i++){
           for( j = item_list.num_item_types; j >= 2; j--){
               if( (item_list.item_typesGet(j).mandatory > item_list.item_typesGet(j - 1).mandatory) ||
                   ((item_list.item_typesGet(j).mandatory === 1) && (item_list.item_typesGet(j - 1).mandatory === 1) && (item_list.item_typesGet(j).sort_criterion > item_list.item_typesGet(j - 1).sort_criterion)) ||
                   ((item_list.item_typesGet(j).mandatory === 0) && (item_list.item_typesGet(j - 1).mandatory === 0) && ((item_list.item_typesGet(j).profit / item_list.item_typesGet(j).volume) > (item_list.item_typesGet(j - 1).profit / item_list.item_typesGet(j - 1).volume))) ){
                   
                   swap_item_type = item_list.item_typesGet(j);
                   item_list.item_types[j] = item_list.item_typesGet(j - 1);
                   item_list.item_types[j - 1] = swap_item_type;
                   
               }
           }
       }
    }
    
    // for( i = 1; <=item_list.num_item_types
    //    MsgBox item_list.item_typesGet(i).id + " " + item_list.item_typesGet(i).weight + " " + item_list.item_typesGet(i).sort_criterion
    // }
    
}

/**
 * @param {solution_data} solution 
 */
function CalculateDistance(solution){

     var j = 0;
     var k = 0;
     var l = 0;
     var max_z = 0;

    //With solution
    
    solution.total_distance = 0;
    solution.total_x_moment = 0;
    solution.total_yz_moment = 0;
    
    for( j = 1; j <= solution.num_containers; j++){

         //With .containerGet(j)
        let container = solution.containerGet(j);
        max_z = 0;
        for( k = 1; k <= container.item_cnt; k++){
               for( l = k + 1; l <= container.item_cnt; l++){
                   if( container.itemsGet(k).item_type === container.itemsGet(l).item_type ){
                       solution.total_distance = solution.total_distance + Math.abs(container.itemsGet(k).opposite_x + container.itemsGet(k).origin_x - container.itemsGet(l).opposite_x - container.itemsGet(l).origin_x) + Math.abs(container.itemsGet(k).opposite_y + container.itemsGet(k).origin_y - container.itemsGet(l).opposite_y - container.itemsGet(l).origin_y) + Math.abs(container.itemsGet(k).opposite_z + container.itemsGet(k).origin_z - container.itemsGet(l).opposite_z - container.itemsGet(l).origin_z);
                   }

                  // solution.total_distance = solution.total_distance + container.itemsGet(k).opposite_z
               }

            if( max_z < container.itemsGet(k).opposite_z ) max_z = container.itemsGet(k).opposite_z;

           // solution.total_distance = solution.total_distance + penalty * max_z
           solution.total_distance = solution.total_distance + container.itemsGet(k).opposite_z;

          // solution.total_x_moment = solution.total_x_moment + (container.itemsGet(k).origin_y + container.itemsGet(k).opposite_y) * item_list.item_typesGet(container.itemsGet(k).item_type).weight

        }

        solution.total_distance = solution.total_distance + container.item_cnt * container.item_cnt * max_z;
    }
    
}

/**
 * @param {solution_data} solution 
 */
function CalculateDispersion(solution){

    var i = 0;
    var j = 0;
    var k = 0;
    var item_flag = false;
    var container_count = 0;
    
    // With solution
    
    solution.total_distance = 0;

    for( i = 1; i <= item_list.num_item_types; i++){
        container_count = 0;
        for( j = 1; j <= solution.num_containers; j++){

            // With .containerGet(j)
            let container = solution.containerGet(j);
            item_flag = false
            for( k = 1; k <= container.item_cnt; k++){
               if( container.itemsGet(k).item_type === i ){
                   item_flag = true;
                   break;
               }
            }

            if( item_flag === true ) container_count = container_count + 1;

        }

        solution.total_distance = solution.total_distance + container_count * container_count;
    }
}

var signaler = new Signaler();
const signals = {
    solution: 'solution'
};

export { 
    CLP_Solver as Execute,
    solution_data as SolutionData,
    item_in_container as ContainerItem,
    signaler,
    signals
};