'This work is licensed under the Creative Commons Attribution 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/.

Option Explicit

Const epsilon As Double = 0.0001

'data declarations

Private Type item_type_data
    id As Long
    width As Double
    height As Double
    length As Double
    volume As Double
    weight As Double
    xy_rotatable As Boolean
    yz_rotatable As Boolean
    mandatory As Long
    profit As Double
    number_requested As Long
    sort_criterion As Double
End Type

Private Type item_list_data
    num_item_types As Long
    total_number_of_items As Long
    item_types() As item_type_data
End Type

Dim item_list As item_list_data

Private Type container_type_data
    type_id As Long
    width As Double
    height As Double
    length As Double
    volume_capacity As Double
    weight_capacity As Double
    mandatory As Long
    cost As Double
    number_available As Long
End Type

Private Type container_list_data
    num_container_types As Long
    container_types() As container_type_data
End Type

Dim container_list As container_list_data

Private Type compatibility_data
    item_to_item() As Boolean
    container_to_item() As Boolean
End Type

Dim compatibility_list As compatibility_data

Private Type item_location
    origin_x As Double
    origin_y As Double
    origin_z As Double
    next_to_item_type As Long
End Type

Private Type item_in_container
    item_type As Long
    rotation As Long '1 to 6
    mandatory As Long
    origin_x As Double
    origin_y As Double
    origin_z As Double
    opposite_x As Double
    opposite_y As Double
    opposite_z As Double
End Type

Private Type container_data
    type_id As Long
    width As Double
    height As Double
    length As Double
    volume_capacity As Double
    weight_capacity As Double
    cost As Double
    item_cnt As Long
    mandatory As Long
    items() As item_in_container
    addition_point_count As Long
    addition_points() As item_location
    repack_item_count() As Long
    volume_packed As Double
    weight_packed As Double
End Type

Private Type solution_data
    num_containers As Long
    feasible As Boolean
    net_profit As Double
    total_volume As Double
    total_weight As Double
    total_distance As Double
    total_x_moment As Double
    total_yz_moment As Double
    rotation_order() As Long
    item_type_order() As Long
    container() As container_data
    unpacked_item_count() As Long
End Type

Private Type instance_data
    front_side_support As Boolean
    item_item_compatibility_worksheet As Boolean 'true if the data exists
    container_item_compatibility_worksheet As Boolean 'true if the data exists
End Type

Dim instance As instance_data

Private Type solver_option_data
    CPU_time_limit As Double
    item_sort_criterion As Long
    show_progress As Boolean
End Type

Dim solver_options As solver_option_data

Private Type candidate_data
    mandatory As Long
    net_profit As Double
    total_volume As Double
    item_type_to_be_added As Long
End Type
Private Sub SortContainers(solution As solution_data, random_reorder_probability As Double)
    
    Dim i As Long
    Dim j As Long
    Dim candidate_index As Long
    Dim max_mandatory As Long
    Dim max_volume_packed As Double
    Dim min_ratio As Double
    Dim swap_container As container_data
        
    'insertion sort

    If Rnd < 1 - random_reorder_probability Then
        
        'insertion sort
    
        With solution
    
            For i = 1 To .num_containers
                candidate_index = i
                max_mandatory = .container(i).mandatory
                max_volume_packed = .container(i).volume_packed
                min_ratio = .container(i).cost / .container(i).volume_capacity
    
                For j = i + 1 To .num_containers
    
                    If (.container(j).mandatory > max_mandatory) Or _
                        ((.container(j).mandatory = max_mandatory) And (.container(j).volume_packed > max_volume_packed + epsilon)) Or _
                        ((.container(j).mandatory = 0) And (max_mandatory = 0) And (.container(j).volume_packed > max_volume_packed - epsilon) And ((.container(j).cost / .container(j).volume_capacity) < min_ratio)) Then
    
                        candidate_index = j
                        max_mandatory = .container(j).mandatory
                        max_volume_packed = .container(j).volume_packed
                        min_ratio = .container(j).cost / .container(j).volume_capacity
    
                    End If
    
                Next j
    
                If candidate_index <> i Then
                    swap_container = .container(candidate_index)
                    .container(candidate_index) = .container(i)
                    .container(i) = swap_container
                End If
    
            Next i

        End With
    Else
        
        With solution
            For i = 1 To .num_containers
                
                candidate_index = Int((.num_containers - i + 1) * Rnd + i)
    
                If candidate_index <> i Then
                    swap_container = .container(candidate_index)
                    .container(candidate_index) = .container(i)
                    .container(i) = swap_container
                End If
    
            Next i
        End With
        
    End If
    
End Sub
Private Sub PerturbSolution(solution As solution_data, container_id As Long, percent_time_left As Double)
    
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    
    Dim swap_long As Long
    
    Dim operator_selection As Double
    Dim container_emptying_probability As Double
    Dim item_removal_probability As Double
    Dim repack_flag As Boolean
    Dim continue_flag As Boolean
    
    Dim max_z As Double
    
    With solution.container(container_id)
    
'            container_emptying_probability = 1 - 0.8 * (.volume_packed / .volume_capacity)
'            item_removal_probability = 1 - 0.8 * (.volume_packed / .volume_capacity)
        
        'test
        
        container_emptying_probability = 0.05 + 0.15 * percent_time_left
        item_removal_probability = 0.05 + 0.15 * percent_time_left
        
        If .item_cnt > 0 Then
        
            If Rnd() < container_emptying_probability Then
                
                'empty the container
                
                For j = 1 To .item_cnt
                
                    solution.unpacked_item_count(.items(j).item_type) = solution.unpacked_item_count(.items(j).item_type) + 1
                    solution.net_profit = solution.net_profit - item_list.item_types(.items(j).item_type).profit
                    
                Next j
                
                solution.net_profit = solution.net_profit + .cost
                solution.total_volume = solution.total_volume - .volume_packed
                solution.total_weight = solution.total_weight - .weight_packed
                
                .item_cnt = 0
                .volume_packed = 0
                .weight_packed = 0
                .addition_point_count = 1
                .addition_points(1).origin_x = 0
                .addition_points(1).origin_y = 0
                .addition_points(1).origin_z = 0
                
            Else
            
                repack_flag = False

                operator_selection = Rnd
                
                If operator_selection < 0.3 Then

                    For j = 1 To .item_cnt

                        If ((solution.feasible = False) And (.items(j).mandatory = 0)) Or (Rnd() < item_removal_probability) Then

                            solution.unpacked_item_count(.items(j).item_type) = solution.unpacked_item_count(.items(j).item_type) + 1

                            solution.net_profit = solution.net_profit - item_list.item_types(.items(j).item_type).profit

                            .items(j).item_type = 0

                            repack_flag = True
                        End If

                    Next j
                   
                ElseIf operator_selection < 0.3 Then
                    
                    max_z = 0
                    For j = 1 To .item_cnt
                        If max_z < .items(j).opposite_z Then max_z = .items(j).opposite_z
                    Next j
                    
                    max_z = max_z * (0.1 + 0.5 * percent_time_left * Rnd)
                    
                    For j = 1 To .item_cnt

                        If ((solution.feasible = False) And (.items(j).mandatory = 0)) Or (.items(j).opposite_z < max_z) Then

                            solution.unpacked_item_count(.items(j).item_type) = solution.unpacked_item_count(.items(j).item_type) + 1

                            solution.net_profit = solution.net_profit - item_list.item_types(.items(j).item_type).profit

                            .items(j).item_type = 0

                            repack_flag = True
                        End If

                    Next j
                    
                Else
                    
                    max_z = 0
                    For j = 1 To .item_cnt
                        If max_z < .items(j).opposite_z Then max_z = .items(j).opposite_z
                    Next j
                    
                    max_z = max_z * (0.6 - 0.5 * percent_time_left * Rnd)
                    
                    For j = 1 To .item_cnt

                        If ((solution.feasible = False) And (.items(j).mandatory = 0)) Or (.items(j).opposite_z > max_z) Then

                            solution.unpacked_item_count(.items(j).item_type) = solution.unpacked_item_count(.items(j).item_type) + 1

                            solution.net_profit = solution.net_profit - item_list.item_types(.items(j).item_type).profit

                            .items(j).item_type = 0

                            repack_flag = True
                        End If

                    Next j
                
                End If

                If repack_flag = True Then

                    For j = 1 To .item_cnt

                        If .items(j).item_type > 0 Then
                            solution.net_profit = solution.net_profit - item_list.item_types(.items(j).item_type).profit
                        End If

                    Next j
                    solution.net_profit = solution.net_profit + .cost
                    solution.total_volume = solution.total_volume - .volume_packed
                    solution.total_weight = solution.total_weight - .weight_packed

                    For j = 1 To item_list.num_item_types
                        .repack_item_count(j) = 0
                    Next j

                    For j = 1 To .item_cnt

                        If .items(j).item_type > 0 Then
                            .repack_item_count(.items(j).item_type) = .repack_item_count(.items(j).item_type) + 1
                        End If

                    Next j

                    .volume_packed = 0
                    .weight_packed = 0
                    .item_cnt = 0
                    .addition_point_count = 1
                    .addition_points(1).origin_x = 0
                    .addition_points(1).origin_y = 0
                    .addition_points(1).origin_z = 0

                    'repack now

                    For j = 1 To item_list.num_item_types

                        continue_flag = True
                        Do While (.repack_item_count(solution.item_type_order(j)) > 0) And (continue_flag = True)
                            continue_flag = AddItemToContainer(solution, container_id, solution.item_type_order(j), 2, True)
                        Loop

                        ' put the remaining items in the unpacked items list

                        solution.unpacked_item_count(solution.item_type_order(j)) = solution.unpacked_item_count(solution.item_type_order(j)) + .repack_item_count(solution.item_type_order(j))
                        .repack_item_count(solution.item_type_order(j)) = 0

                    Next j

                End If
            
            End If
        
        End If
        
    End With

    
    'change the preferred rotation order randomly
    
    For i = 1 To item_list.num_item_types
        
        For j = 1 To 6
            
            k = Int((6 - j + 1) * Rnd + j) ' the order to swap with
            
            swap_long = solution.rotation_order(i, j)
            solution.rotation_order(i, j) = solution.rotation_order(i, k)
            solution.rotation_order(i, k) = swap_long
            
        Next j
        
        'MsgBox ("Item type " & i & " rotation order: " & solution.rotation_order(i, 1) & solution.rotation_order(i, 2) & solution.rotation_order(i, 3) & solution.rotation_order(i, 4) & solution.rotation_order(i, 5) & solution.rotation_order(i, 6))
        
    Next i
    
    'change the item order randomly - test

    For i = 1 To item_list.num_item_types

        j = Int((item_list.num_item_types - i + 1) * Rnd + i) ' the order to swap with

        swap_long = solution.item_type_order(i)
        solution.item_type_order(i) = solution.item_type_order(j)
        solution.item_type_order(j) = swap_long

    Next i
    
End Sub
Private Function AddItemToContainer(solution As solution_data, container_index As Long, item_type_index As Long, add_type As Long, item_cohesion As Boolean)
    
    Dim i As Long
    Dim j As Long
    Dim k As Long
    
    Dim rotation_index As Long
    
    Dim origin_x As Double
    Dim origin_y As Double
    Dim origin_z As Double
    Dim opposite_x As Double
    Dim opposite_y As Double
    Dim opposite_z As Double
    
    Dim min_x As Double
    Dim min_y As Double
    Dim min_z As Double
    Dim next_to_item_type As Long
    
    Dim candidate_position As Double
    Dim current_rotation As Long
    Dim candidate_rotation As Long
    
    Dim area_supported As Double
    Dim area_required As Double
    Dim intersection_right As Double
    Dim intersection_left As Double
    Dim intersection_top As Double
    Dim intersection_bottom As Double
    Dim support_flag As Boolean
    
    With solution.container(container_index)
    
        min_x = .width + 1
        min_y = .height + 1
        min_z = .length + 1
        next_to_item_type = 0
        
        candidate_position = 0
        
        'compatibility check
        
        If instance.container_item_compatibility_worksheet = True Then
            If compatibility_list.container_to_item(.type_id, item_list.item_types(item_type_index).id) = False Then GoTo AddItemToContainer_Finish
        End If
        
        'volume size check
        
        If .volume_packed + item_list.item_types(item_type_index).volume > .volume_capacity Then GoTo AddItemToContainer_Finish
        
        'weight capacity check
        
        If .weight_packed + item_list.item_types(item_type_index).weight > .weight_capacity Then GoTo AddItemToContainer_Finish
        
        'item to item compatibility check
        
        If instance.item_item_compatibility_worksheet = True Then
            For i = 1 To .item_cnt
                If compatibility_list.item_to_item(item_list.item_types(item_type_index).id, item_list.item_types(.items(i).item_type).id) = False Then GoTo AddItemToContainer_Finish
            Next i
        End If
    
        For rotation_index = 1 To 6
        
            'test
            'If candidate_position <> 0 Then GoTo AddItemToContainer_Finish
        
            current_rotation = solution.rotation_order(item_type_index, rotation_index)
            
            'forbidden rotations
            
            If ((current_rotation = 3) Or (current_rotation = 4)) And (item_list.item_types(item_type_index).xy_rotatable = False) Then
                GoTo next_rotation_iteration
            End If

            If ((current_rotation = 5) Or (current_rotation = 6)) And (item_list.item_types(item_type_index).yz_rotatable = False) Then
                GoTo next_rotation_iteration
            End If
            
            'symmetry breaking
            
            If (current_rotation = 2) And (Abs(item_list.item_types(item_type_index).width - item_list.item_types(item_type_index).length) < epsilon) Then
                GoTo next_rotation_iteration
            End If
            
            If (current_rotation = 4) And (Abs(item_list.item_types(item_type_index).width - item_list.item_types(item_type_index).height) < epsilon) Then
                GoTo next_rotation_iteration
            End If
            
            If (current_rotation = 6) And (Abs(item_list.item_types(item_type_index).height - item_list.item_types(item_type_index).length) < epsilon) Then
                GoTo next_rotation_iteration
            End If
                
            For i = 1 To .addition_point_count
                
                If (item_cohesion = True) And (candidate_position <> 0) And (next_to_item_type = item_type_index) And (.addition_points(i).next_to_item_type <> item_type_index) Then GoTo next_iteration
                
                origin_x = .addition_points(i).origin_x
                origin_y = .addition_points(i).origin_y
                origin_z = .addition_points(i).origin_z
                
                If current_rotation = 1 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).width
                    opposite_y = origin_y + item_list.item_types(item_type_index).height
                    opposite_z = origin_z + item_list.item_types(item_type_index).length
                ElseIf current_rotation = 2 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).length
                    opposite_y = origin_y + item_list.item_types(item_type_index).height
                    opposite_z = origin_z + item_list.item_types(item_type_index).width
                ElseIf current_rotation = 3 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).width
                    opposite_y = origin_y + item_list.item_types(item_type_index).length
                    opposite_z = origin_z + item_list.item_types(item_type_index).height
                ElseIf current_rotation = 4 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).height
                    opposite_y = origin_y + item_list.item_types(item_type_index).length
                    opposite_z = origin_z + item_list.item_types(item_type_index).width
                ElseIf current_rotation = 5 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).height
                    opposite_y = origin_y + item_list.item_types(item_type_index).width
                    opposite_z = origin_z + item_list.item_types(item_type_index).length
                ElseIf current_rotation = 6 Then
                    opposite_x = origin_x + item_list.item_types(item_type_index).length
                    opposite_y = origin_y + item_list.item_types(item_type_index).width
                    opposite_z = origin_z + item_list.item_types(item_type_index).height
                End If
                
                'check the feasibility of all four corners, w.r.t to the other items
                
                If (opposite_x > .width + epsilon) Or (opposite_y > .height + epsilon) Or (opposite_z > .length + epsilon) Then GoTo next_iteration
                
                For j = 1 To .item_cnt
                               
                    If (opposite_x < .items(j).origin_x + epsilon) Or _
                        (.items(j).opposite_x < origin_x + epsilon) Or _
                        (opposite_y < .items(j).origin_y + epsilon) Or _
                        (.items(j).opposite_y < origin_y + epsilon) Or _
                        (opposite_z < .items(j).origin_z + epsilon) Or _
                        (.items(j).opposite_z < origin_z + epsilon) Then
                        'no conflict
                    Else
                        'conflict
                        GoTo next_iteration
                    End If
                Next j
                                
                'vertical support
                
                If origin_y < epsilon Then
                    support_flag = True
                Else
                    area_supported = 0
                    area_required = ((opposite_x - origin_x) * (opposite_z - origin_z))
                    support_flag = False
                    For j = .item_cnt To 1 Step -1
                                
                        If (Abs(origin_y - .items(j).opposite_y) < epsilon) Then
                            
                            'check for intersection
                            
                            intersection_right = opposite_x
                            If intersection_right > .items(j).opposite_x Then intersection_right = .items(j).opposite_x
                            
                            intersection_left = origin_x
                            If intersection_left < .items(j).origin_x Then intersection_left = .items(j).origin_x
                            
                            intersection_top = opposite_z
                            If intersection_top > .items(j).opposite_z Then intersection_top = .items(j).opposite_z
                            
                            intersection_bottom = origin_z
                            If intersection_bottom < .items(j).origin_z Then intersection_bottom = .items(j).origin_z
                            
                            If (intersection_right > intersection_left) And (intersection_top > intersection_bottom) Then
                                area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom)
                                If area_supported > area_required - epsilon Then
                                    support_flag = True
                                    Exit For
                                End If
                            End If
                            
                        End If
                    Next j
                    
                End If
                
                If support_flag = False Then GoTo next_iteration
                
                'side support
                'TODO: new icons for the menu

                If instance.front_side_support = True Then
                    If origin_z < epsilon Then
                        support_flag = True
                    Else
                        area_supported = 0
                        area_required = ((opposite_x - origin_x) * (opposite_y - origin_y))
                        support_flag = False
                        For j = .item_cnt To 1 Step -1
    
                            If (Abs(origin_z - .items(j).opposite_z) < epsilon) Then
    
                                'check for intersection
    
                                intersection_right = opposite_x
                                If intersection_right > .items(j).opposite_x Then intersection_right = .items(j).opposite_x
    
                                intersection_left = origin_x
                                If intersection_left < .items(j).origin_x Then intersection_left = .items(j).origin_x
    
                                intersection_top = opposite_y
                                If intersection_top > .items(j).opposite_y Then intersection_top = .items(j).opposite_y
    
                                intersection_bottom = origin_y
                                If intersection_bottom < .items(j).origin_y Then intersection_bottom = .items(j).origin_y
    
                                If (intersection_right > intersection_left) And (intersection_top > intersection_bottom) Then
                                    area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom)
                                    If area_supported > area_required - epsilon Then
                                        support_flag = True
                                        Exit For
                                    End If
                                End If
    
                            End If
                        Next j
    
                    End If
                End If
                
                If support_flag = False Then GoTo next_iteration
                
                'no conflicts at this point
                
                If (item_cohesion = True) And (next_to_item_type <> item_type_index) And (.addition_points(i).next_to_item_type = item_type_index) Then
                   min_x = origin_x
                   min_y = origin_y
                   min_z = origin_z
                   candidate_position = i
                   candidate_rotation = current_rotation
                   next_to_item_type = .addition_points(i).next_to_item_type
                Else
                    If (origin_z < min_z) Or _
                      ((origin_z <= min_z + epsilon) And (origin_y < min_y)) Or _
                      ((origin_z <= min_z + epsilon) And (origin_y <= min_y + epsilon) And (origin_x < min_x)) Then 'Or _
                      ((origin_z <= min_z + epsilon) And (origin_y <= min_y + epsilon) And (origin_x <= min_x + epsilon) And ((opposite_x > .width + epsilon) Or (opposite_y > .height + epsilon))) Then
                       min_x = origin_x
                       min_y = origin_y
                       min_z = origin_z
                       candidate_position = i
                       candidate_rotation = current_rotation
                       next_to_item_type = .addition_points(i).next_to_item_type
                    End If
                End If

next_iteration:
            Next i

next_rotation_iteration:
        Next rotation_index
        
    End With
    
AddItemToContainer_Finish:

    If candidate_position = 0 Then
        AddItemToContainer = False
    Else
        With solution.container(container_index)
            .item_cnt = .item_cnt + 1
            .items(.item_cnt).item_type = item_type_index
            .items(.item_cnt).origin_x = .addition_points(candidate_position).origin_x
            .items(.item_cnt).origin_y = .addition_points(candidate_position).origin_y
            .items(.item_cnt).origin_z = .addition_points(candidate_position).origin_z
            .items(.item_cnt).rotation = candidate_rotation
            .items(.item_cnt).mandatory = item_list.item_types(item_type_index).mandatory
            
            If candidate_rotation = 1 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).width
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).height
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).length
            ElseIf candidate_rotation = 2 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).length
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).height
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).width
            ElseIf candidate_rotation = 3 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).width
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).length
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).height
            ElseIf candidate_rotation = 4 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).height
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).length
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).width
            ElseIf candidate_rotation = 5 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).height
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).width
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).length
            ElseIf candidate_rotation = 6 Then
                .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).length
                .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).width
                .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).height
            End If
            
            .volume_packed = .volume_packed + item_list.item_types(item_type_index).volume
            .weight_packed = .weight_packed + item_list.item_types(item_type_index).weight

            If add_type = 2 Then
                .repack_item_count(item_type_index) = .repack_item_count(item_type_index) - 1
            End If
            
            'update the addition points
            
            For i = candidate_position To .addition_point_count - 1
                .addition_points(i) = .addition_points(i + 1)
            Next i
            
            .addition_point_count = .addition_point_count - 1
            
            If (.items(.item_cnt).opposite_x < .width - epsilon) And (.items(.item_cnt).origin_y < .height - epsilon) And (.items(.item_cnt).origin_z < .length - epsilon) Then
            
                .addition_point_count = .addition_point_count + 1
                .addition_points(.addition_point_count).origin_x = .items(.item_cnt).opposite_x
                .addition_points(.addition_point_count).origin_y = .items(.item_cnt).origin_y
                .addition_points(.addition_point_count).origin_z = .items(.item_cnt).origin_z
                .addition_points(.addition_point_count).next_to_item_type = item_type_index
                
            End If
            
            If (.items(.item_cnt).origin_x < .width - epsilon) And (.items(.item_cnt).opposite_y < .height - epsilon) And (.items(.item_cnt).origin_z < .length - epsilon) Then
                
                .addition_point_count = .addition_point_count + 1
                .addition_points(.addition_point_count).origin_x = .items(.item_cnt).origin_x
                .addition_points(.addition_point_count).origin_y = .items(.item_cnt).opposite_y
                .addition_points(.addition_point_count).origin_z = .items(.item_cnt).origin_z
                .addition_points(.addition_point_count).next_to_item_type = item_type_index
                
            End If
            
            If (.items(.item_cnt).origin_x < .width - epsilon) And (.items(.item_cnt).origin_y < .height - epsilon) And (.items(.item_cnt).opposite_z < .length - epsilon) Then
            
                .addition_point_count = .addition_point_count + 1
                .addition_points(.addition_point_count).origin_x = .items(.item_cnt).origin_x
                .addition_points(.addition_point_count).origin_y = .items(.item_cnt).origin_y
                .addition_points(.addition_point_count).origin_z = .items(.item_cnt).opposite_z
                .addition_points(.addition_point_count).next_to_item_type = item_type_index
                        
            End If
            
        End With
        
        With solution
            'update the profit
            
            If .container(container_index).item_cnt = 1 Then
                .net_profit = .net_profit + item_list.item_types(item_type_index).profit - .container(container_index).cost
            Else
                .net_profit = .net_profit + item_list.item_types(item_type_index).profit
            End If
            
            'update the volume per container and the total volume
            
            .total_volume = .total_volume + item_list.item_types(item_type_index).volume
            .total_weight = .total_weight + item_list.item_types(item_type_index).weight
            
            'update the unpacked items
            
            If add_type = 1 Then
                .unpacked_item_count(item_type_index) = .unpacked_item_count(item_type_index) - 1
            End If
            
        End With
        
        AddItemToContainer = True
    End If
    
End Function

Private Sub GetSolverOptions()
    ThisWorkbook.Worksheets("CLP Solver Console").Activate
    
    With solver_options
        
        If Cells(12, 3).Value = "Volume" Then
            .item_sort_criterion = 1
        ElseIf Cells(12, 3).Value = "Weight" Then
            .item_sort_criterion = 2
        Else
            .item_sort_criterion = 3
        End If
        
        If Cells(13, 3).Value = "Yes" Then
            .show_progress = True
        Else
            .show_progress = False
        End If
        
        .CPU_time_limit = Cells(14, 3).Value
        
    End With
End Sub
Private Sub GetItemData()
    
    item_list.num_item_types = ThisWorkbook.Worksheets("CLP Solver Console").Cells(2, 3).Value
    item_list.total_number_of_items = 0
    
    ReDim item_list.item_types(1 To item_list.num_item_types)
    
    ThisWorkbook.Worksheets("1.Items").Activate
    
    Dim i As Long
    Dim max_volume As Double
    Dim max_weight As Double
    
    max_volume = 0
    max_weight = 0
    
    With item_list
        
        For i = 1 To .num_item_types
            
            .item_types(i).id = i
            
            .item_types(i).width = Cells(2 + i, 4).Value
            .item_types(i).height = Cells(2 + i, 5).Value
            .item_types(i).length = Cells(2 + i, 6).Value
            
            .item_types(i).volume = Cells(2 + i, 7).Value
            
            If max_volume < .item_types(i).volume Then
                max_volume = .item_types(i).volume
            End If
            
            If Cells(2 + i, 9).Value = "Yes" Then
                .item_types(i).xy_rotatable = True
            Else
                .item_types(i).xy_rotatable = False
            End If
            
            If Cells(2 + i, 10).Value = "Yes" Then
                .item_types(i).yz_rotatable = True
            Else
                .item_types(i).yz_rotatable = False
            End If
            
            If (Abs(.item_types(i).width - .item_types(i).height) < epsilon) And (Abs(.item_types(i).width - .item_types(i).length) < epsilon) Then
                .item_types(i).xy_rotatable = False
                .item_types(i).yz_rotatable = False
            End If
            
            .item_types(i).weight = Cells(2 + i, 11).Value
            
            If max_weight < .item_types(i).weight Then
                max_weight = .item_types(i).weight
            End If
            
            If Cells(2 + i, 12).Value = "Must be packed" Then
                .item_types(i).mandatory = 1
            ElseIf Cells(2 + i, 12).Value = "May be packed" Then
                .item_types(i).mandatory = 0
            ElseIf Cells(2 + i, 12).Value = "Don't pack" Then
                .item_types(i).mandatory = -1
            End If
            
            .item_types(i).profit = Cells(2 + i, 13).Value
            
            .item_types(i).number_requested = Cells(2 + i, 14).Value
            
            item_list.total_number_of_items = item_list.total_number_of_items + .item_types(i).number_requested
        
        Next i
        
        For i = 1 To .num_item_types
        
            If solver_options.item_sort_criterion = 1 Then
                .item_types(i).sort_criterion = .item_types(i).volume * (max_weight + 1) + .item_types(i).weight
            ElseIf solver_options.item_sort_criterion = 2 Then
                .item_types(i).sort_criterion = .item_types(i).weight * (max_volume + 1) + .item_types(i).volume
            Else
                .item_types(i).sort_criterion = .item_types(i).width
                If .item_types(i).sort_criterion < .item_types(i).height Then
                    .item_types(i).sort_criterion = .item_types(i).height
                End If
                If .item_types(i).sort_criterion < .item_types(i).length Then
                    .item_types(i).sort_criterion = .item_types(i).length
                End If
                
                .item_types(i).sort_criterion = .item_types(i).sort_criterion * (max_volume + 1) + .item_types(i).volume
            End If
        Next i
    
    End With
    
End Sub
Private Sub GetContainerData()
    
    container_list.num_container_types = ThisWorkbook.Worksheets("CLP Solver Console").Cells(4, 3).Value
    
    ReDim container_list.container_types(1 To container_list.num_container_types)
    
    ThisWorkbook.Worksheets("2.Containers").Activate
    
    Dim i As Long
    
    With container_list
        
        For i = 1 To .num_container_types
            
            .container_types(i).type_id = i
            
            .container_types(i).width = Cells(1 + i, 3).Value
            .container_types(i).height = Cells(1 + i, 4).Value
            .container_types(i).length = Cells(1 + i, 5).Value
            
            .container_types(i).volume_capacity = Cells(1 + i, 6).Value
            .container_types(i).weight_capacity = Cells(1 + i, 7).Value
            
            If Cells(1 + i, 8).Value = "Must be used" Then
                .container_types(i).mandatory = 1
            ElseIf Cells(1 + i, 8).Value = "May be used" Then
                .container_types(i).mandatory = 0
            ElseIf Cells(1 + i, 8).Value = "Do not use" Then
                .container_types(i).mandatory = -1
            End If
            
            .container_types(i).cost = Cells(1 + i, 9).Value
            
            .container_types(i).number_available = Cells(1 + i, 10).Value
        
        Next i
    
    End With
    
End Sub
Private Sub GetCompatibilityData()
    
    With compatibility_list
        
        Dim i As Long
        Dim j As Long
        Dim k As Long

        If instance.item_item_compatibility_worksheet = True Then
        
            ReDim .item_to_item(1 To item_list.num_item_types, 1 To item_list.num_item_types)
            
            For i = 1 To item_list.num_item_types
                For j = 1 To item_list.num_item_types
                
                    .item_to_item(i, j) = True
                    
                Next j
            Next i
            
            k = 3
            For i = 1 To item_list.num_item_types
                For j = i + 1 To item_list.num_item_types
                
                    If ThisWorkbook.Worksheets("1.3.Item-Item Compatibility").Cells(k, 3) = "No" Then
                        .item_to_item(i, j) = False
                        .item_to_item(j, i) = False
                    End If
                        
                    k = k + 1
                Next j
            Next i
            
        End If
        
        If instance.container_item_compatibility_worksheet = True Then
        
            ReDim .container_to_item(1 To container_list.num_container_types, 1 To item_list.num_item_types)
            
            For i = 1 To container_list.num_container_types
                For j = 1 To item_list.num_item_types
                
                    .container_to_item(i, j) = True
                    
                Next j
            Next i
            
            k = 3
            For i = 1 To container_list.num_container_types
                For j = 1 To item_list.num_item_types
                
                    If ThisWorkbook.Worksheets("2.3.Container-ItemCompatibility").Cells(k, 3) = "No" Then
                        .container_to_item(i, j) = False
                    End If
                        
                    k = k + 1
                Next j
            Next i
            
        End If

    End With
    
End Sub
Private Sub InitializeSolution(solution As solution_data)
    
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    
    With solution
        .feasible = False
        .net_profit = 0
        .total_volume = 0
        .total_weight = 0
        .total_distance = 0
        .total_x_moment = 0
        .total_yz_moment = 0
        
        .num_containers = 0
        For i = 1 To container_list.num_container_types
            If container_list.container_types(i).mandatory >= 0 Then
                .num_containers = .num_containers + container_list.container_types(i).number_available
            End If
        Next i
        
        ReDim .rotation_order(1 To item_list.num_item_types, 1 To 6)
        For i = 1 To item_list.num_item_types
            For j = 1 To 6
                .rotation_order(i, j) = j
            Next j
        Next i
        
        ReDim .item_type_order(1 To item_list.num_item_types)
        For i = 1 To item_list.num_item_types
            .item_type_order(i) = i
        Next i
        
        ReDim .container(1 To .num_containers)
        For i = 1 To .num_containers
            ReDim .container(i).items(1 To item_list.total_number_of_items)
            ReDim .container(i).addition_points(1 To 3 * item_list.total_number_of_items)
            ReDim .container(i).repack_item_count(1 To item_list.total_number_of_items)
        Next i
        
        ReDim .unpacked_item_count(1 To item_list.num_item_types)
        
        l = 1
        For i = 1 To container_list.num_container_types
            If container_list.container_types(i).mandatory >= 0 Then
                For j = 1 To container_list.container_types(i).number_available
                    
                    .container(l).width = container_list.container_types(i).width
                    .container(l).height = container_list.container_types(i).height
                    .container(l).length = container_list.container_types(i).length
                    .container(l).volume_capacity = container_list.container_types(i).volume_capacity
                    .container(l).weight_capacity = container_list.container_types(i).weight_capacity
                    .container(l).cost = container_list.container_types(i).cost
                    .container(l).mandatory = container_list.container_types(i).mandatory
                    .container(l).type_id = i
                    .container(l).volume_packed = 0
                    .container(l).weight_packed = 0
                    .container(l).item_cnt = 0
                    
                    .container(l).addition_point_count = 1
                    
                    For k = 1 To item_list.total_number_of_items
                        .container(l).items(k).item_type = 0
                        .container(l).addition_points(k).origin_x = 0
                        .container(l).addition_points(k).origin_y = 0
                        .container(l).addition_points(k).origin_z = 0
                        .container(l).addition_points(k).next_to_item_type = 0
                    Next k
                    
                    For k = 1 To item_list.total_number_of_items
                        .container(l).repack_item_count(k) = 0
                    Next k
                    
                    l = l + 1
                Next j
            End If
        Next i
        
        For i = 1 To item_list.num_item_types
            .unpacked_item_count(i) = item_list.item_types(i).number_requested
        Next i
        
    End With
    
End Sub

Private Sub GetInstanceData()
    
    If ThisWorkbook.Worksheets("CLP SOlver Console").Cells(6, 3).Value = "Yes" Then
        instance.front_side_support = True
    Else
        instance.front_side_support = False
    End If
    
    If CheckWorksheetExistence("1.3.Item-Item Compatibility") = True Then
        instance.item_item_compatibility_worksheet = True
    Else
        instance.item_item_compatibility_worksheet = False
    End If
        
    If CheckWorksheetExistence("2.3.Container-ItemCompatibility") = True Then
        instance.container_item_compatibility_worksheet = True
    Else
        instance.container_item_compatibility_worksheet = False
    End If
    
End Sub
Private Sub WriteSolution(solution As solution_data)
   
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
            
    Dim i As Long
    Dim j As Long
    Dim k As Long
    
    Dim container_index As Long
    
    Dim swap_container As container_data
    
    'sort the containers
    
    For i = 1 To solution.num_containers
        For j = solution.num_containers To 2 Step -1
            If (solution.container(j).type_id < solution.container(j - 1).type_id) Or _
                ((solution.container(j).type_id = solution.container(j - 1).type_id) And (solution.container(j).volume_packed > solution.container(j - 1).volume_packed)) Then
                swap_container = solution.container(j)
                solution.container(j) = solution.container(j - 1)
                solution.container(j - 1) = swap_container
            End If
        Next j
    Next i
    
    ThisWorkbook.Worksheets("3.Solution").Activate

    If solution.feasible = False Then
        Cells(2, 1) = "Warning: Last solution returned by the solver does not satisfy all constraints."
        Range(Cells(2, 1), Cells(2, 10)).Interior.ColorIndex = 45
    Else
        Cells(2, 1) = vbNullString
        Range(Cells(2, 1), Cells(2, 10)).Interior.Pattern = xlNone
        Range(Cells(2, 1), Cells(2, 10)).Interior.TintAndShade = 0
        Range(Cells(2, 1), Cells(2, 10)).Interior.PatternTintAndShade = 0
    End If
    
    Dim offset As Long
    
    offset = 0
    container_index = 1
    
    With solution
    
        For i = 1 To container_list.num_container_types
        
            For j = 1 To container_list.container_types(i).number_available
    
                Range(Cells(6, offset + 2), Cells(5 + 2 * item_list.total_number_of_items, offset + 2)).Value = vbNullString
                Range(Cells(6, offset + 3), Cells(5 + 2 * item_list.total_number_of_items, offset + 5)).ClearContents
                Range(Cells(6, offset + 6), Cells(5 + 2 * item_list.total_number_of_items, offset + 6)).Value = vbNullString
                
                
                If container_list.container_types(i).mandatory >= 0 Then
                        
                    For k = 1 To .container(container_index).item_cnt
                        Cells(5 + k, offset + 2).Value = ThisWorkbook.Worksheets("1.Items").Cells(2 + item_list.item_types(.container(container_index).items(k).item_type).id, 2).Value
                        Cells(5 + k, offset + 3).Value = .container(container_index).items(k).origin_x
                        Cells(5 + k, offset + 4).Value = .container(container_index).items(k).origin_y
                        Cells(5 + k, offset + 5).Value = .container(container_index).items(k).origin_z
                        If .container(container_index).items(k).rotation = 1 Then
                            Cells(5 + k, offset + 6).Value = "xyz"
                        ElseIf .container(container_index).items(k).rotation = 2 Then
                            Cells(5 + k, offset + 6).Value = "zyx"
                        ElseIf .container(container_index).items(k).rotation = 3 Then
                            Cells(5 + k, offset + 6).Value = "xzy"
                        ElseIf .container(container_index).items(k).rotation = 4 Then
                            Cells(5 + k, offset + 6).Value = "yzx"
                        ElseIf .container(container_index).items(k).rotation = 5 Then
                            Cells(5 + k, offset + 6).Value = "yxz"
                        ElseIf .container(container_index).items(k).rotation = 6 Then
                            Cells(5 + k, offset + 6).Value = "zxy"
                        End If
                    Next k
                        
                    container_index = container_index + 1
                End If
                
                offset = offset + 11
            Next j
        Next i
    End With
    
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
End Sub

Sub ReadSolution(solution As solution_data)
       
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
            
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    
    Dim container_index As Long
    Dim item_type_index As Long
    
    Dim offset As Long
    
    offset = 0
    container_index = 1
    
    With solution
    
        For i = 1 To container_list.num_container_types
        
            For j = 1 To container_list.container_types(i).number_available
                    
                If container_list.container_types(i).mandatory >= 0 Then
                    
                    With .container(container_index)
                        
                        l = Cells(4, offset + 7).Value
                        
                        For k = 1 To l
                            If IsNumeric(Cells(5 + k, offset + 7).Value) = True Then
                            
                                .item_cnt = .item_cnt + 1
                                
                                item_type_index = Cells(5 + k, offset + 7).Value
                                
                                solution.unpacked_item_count(item_type_index) = solution.unpacked_item_count(item_type_index) - 1
                                
                                .items(.item_cnt).item_type = item_type_index
                                .items(.item_cnt).origin_x = Cells(5 + k, offset + 3).Value
                                .items(.item_cnt).origin_y = Cells(5 + k, offset + 4).Value
                                .items(.item_cnt).origin_z = Cells(5 + k, offset + 5).Value
                                
                                If ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "xyz" Then
                                    .items(.item_cnt).rotation = 1
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).width
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).height
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).length
                                ElseIf ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "zyx" Then
                                    .items(.item_cnt).rotation = 2
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).length
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).height
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).width
                                ElseIf ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "xzy" Then
                                    .items(.item_cnt).rotation = 3
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).width
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).length
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).height
                                ElseIf ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "yzx" Then
                                    .items(.item_cnt).rotation = 4
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).height
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).length
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).width
                                ElseIf ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "yxz" Then
                                    .items(.item_cnt).rotation = 5
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).height
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).width
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).length
                                ElseIf ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 6).Value = "zxy" Then
                                    .items(.item_cnt).rotation = 6
                                    .items(.item_cnt).opposite_x = .items(.item_cnt).origin_x + item_list.item_types(item_type_index).length
                                    .items(.item_cnt).opposite_y = .items(.item_cnt).origin_y + item_list.item_types(item_type_index).width
                                    .items(.item_cnt).opposite_z = .items(.item_cnt).origin_z + item_list.item_types(item_type_index).height
                                End If
                        
                                .volume_packed = .volume_packed + item_list.item_types(item_type_index).volume
                                .weight_packed = .weight_packed + item_list.item_types(item_type_index).weight
                                
                                If .item_cnt = 1 Then
                                    solution.net_profit = solution.net_profit + item_list.item_types(item_type_index).profit - .cost
                                Else
                                    solution.net_profit = solution.net_profit + item_list.item_types(item_type_index).profit
                                End If
                                
                            End If
                        Next k
                        
                    End With
                    
                    container_index = container_index + 1
                End If
                
                offset = offset + 11
            Next j
        Next i
    End With
    
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
End Sub
Sub CLP_Solver()
    
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    Dim WorksheetExists As Boolean
    Dim reply As Integer
    
    WorksheetExists = CheckWorksheetExistence("1.Items") And CheckWorksheetExistence("2.Containers") And CheckWorksheetExistence("3.Solution")
    If WorksheetExists = False Then
        MsgBox "Worksheets 1.Items, 2.Containers, and 3.Solution must exist for the CLP Spreadsheet Solver to function."
        Application.ScreenUpdating = True
        Application.Calculation = xlCalculationAutomatic
        Exit Sub
    Else
        reply = MsgBox("This will take " & ThisWorkbook.Worksheets("CLP Solver Console").Cells(14, 3).Value & " seconds. Do you want to continue?", vbYesNo, "CLP Spreadsheet Solver")
        If reply = vbNo Then
            Application.ScreenUpdating = True
            Application.Calculation = xlCalculationAutomatic
            Exit Sub
        End If
    End If
    
    Application.EnableCancelKey = xlErrorHandler
    On Error GoTo CLP_Solver_Finish
    
    'Allocate memory and get the data
    
    Call GetSolverOptions
    Call GetItemData
    Call GetContainerData
    Call GetInstanceData
    Call GetCompatibilityData
    
    Call SortItems
    
    Dim incumbent As solution_data
    Call InitializeSolution(incumbent)
        
    Dim best_known As solution_data
    Call InitializeSolution(best_known)
    best_known = incumbent
    
    Dim iteration As Long
    
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    
    Dim nonempty_container_cnt As Long
    Dim container_id As Long
    
    Dim start_time As Double
    Dim end_time As Double
    
    Dim continue_flag As Boolean
    Dim sort_criterion As Double
    Dim selected_rotation As Double
    
    'infeasibility check
    
    Dim infeasibility_count As Long
    Dim infeasibility_string As String

    Call FeasibilityCheckData(infeasibility_count, infeasibility_string)

    If infeasibility_count > 0 Then
        reply = MsgBox("Infeasibilities detected." & Chr(13) & infeasibility_string & "Do you want to continue?", vbYesNo, "CLP Spreadsheet Solver")
        If reply = vbNo Then
            Application.ScreenUpdating = True
            Application.Calculation = xlCalculationAutomatic
            Exit Sub
        End If
    End If
    
    start_time = Timer
    end_time = Timer
        
    'constructive phase
    
    If solver_options.show_progress = True Then
        Application.ScreenUpdating = True
        Application.StatusBar = "Constructive phase..."
        Application.ScreenUpdating = False
    Else
        Application.ScreenUpdating = True
        Application.StatusBar = "LNS algorithm running..."
        Application.ScreenUpdating = False
    End If
    
    Call SortContainers(incumbent, 0)
    
    For i = 1 To incumbent.num_containers
        
        'sort the rotation order for this container
        
        For j = 1 To item_list.num_item_types
            
            sort_criterion = 0
            selected_rotation = 0
            
            If sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).width) * item_list.item_types(j).width) * (Int(incumbent.container(i).height / item_list.item_types(j).height) * item_list.item_types(j).height) Then
                sort_criterion = (Int(incumbent.container(i).width / item_list.item_types(j).width) * item_list.item_types(j).width) * (Int(incumbent.container(i).height / item_list.item_types(j).height) * item_list.item_types(j).height)
                selected_rotation = 1
            End If
            
            If sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).length) * item_list.item_types(j).length) * (Int(incumbent.container(i).height / item_list.item_types(j).height) * item_list.item_types(j).height) Then
                sort_criterion = (Int(incumbent.container(i).width / item_list.item_types(j).length) * item_list.item_types(j).length) * (Int(incumbent.container(i).height / item_list.item_types(j).height) * item_list.item_types(j).height)
                selected_rotation = 2
            End If
            
            If (item_list.item_types(j).xy_rotatable = True) And (sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).width) * item_list.item_types(j).width) * (Int(incumbent.container(i).height / item_list.item_types(j).length) * item_list.item_types(j).length)) Then
                sort_criterion = (Int(incumbent.container(i).width / item_list.item_types(j).width) * item_list.item_types(j).width) * (Int(incumbent.container(i).height / item_list.item_types(j).length) * item_list.item_types(j).length)
                selected_rotation = 3
            End If
            
            If (item_list.item_types(j).xy_rotatable = True) And (sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).height) * item_list.item_types(j).height) * (Int(incumbent.container(i).height / item_list.item_types(j).length) * item_list.item_types(j).length)) Then
                sort_criterion = sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).height) * item_list.item_types(j).height) * (Int(incumbent.container(i).height / item_list.item_types(j).length) * item_list.item_types(j).length)
                selected_rotation = 4
            End If
            
            If (item_list.item_types(j).yz_rotatable = True) And (sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).height) * item_list.item_types(j).height) * (Int(incumbent.container(i).height / item_list.item_types(j).width) * item_list.item_types(j).width)) Then
                sort_criterion = (Int(incumbent.container(i).width / item_list.item_types(j).height) * item_list.item_types(j).height) * (Int(incumbent.container(i).height / item_list.item_types(j).width) * item_list.item_types(j).width)
                selected_rotation = 5
            End If
            
            If (item_list.item_types(j).yz_rotatable = True) And (sort_criterion < (Int(incumbent.container(i).width / item_list.item_types(j).length) * item_list.item_types(j).length) * (Int(incumbent.container(i).height / item_list.item_types(j).width) * item_list.item_types(j).width)) Then
                sort_criterion = (Int(incumbent.container(i).width / item_list.item_types(j).length) * item_list.item_types(j).length) * (Int(incumbent.container(i).height / item_list.item_types(j).width) * item_list.item_types(j).width)
                selected_rotation = 6
            End If
            
            If selected_rotation = 0 Then
                selected_rotation = 1
            End If
            
            incumbent.rotation_order(j, 1) = selected_rotation
            incumbent.rotation_order(j, selected_rotation) = 1
        Next j
        
        For j = 1 To item_list.num_item_types
        
            continue_flag = True
            Do While (incumbent.unpacked_item_count(incumbent.item_type_order(j)) > 0) And (continue_flag = True)
                continue_flag = AddItemToContainer(incumbent, i, incumbent.item_type_order(j), 1, False)
            Loop
        Next j
        
        incumbent.feasible = True
        For j = 1 To item_list.num_item_types
            If (incumbent.unpacked_item_count(j) > 0) And (item_list.item_types(j).mandatory = 1) Then
                incumbent.feasible = False
                Exit For
            End If
        Next j
        
        Call CalculateDispersion(incumbent)

        If ((incumbent.feasible = True) And (best_known.feasible = False)) Or _
           ((incumbent.feasible = False) And (best_known.feasible = False) And (incumbent.total_volume > best_known.total_volume + epsilon)) Or _
           ((incumbent.feasible = True) And (best_known.feasible = True) And (incumbent.net_profit > best_known.net_profit + epsilon)) Or _
           ((incumbent.feasible = True) And (best_known.feasible = True) And (incumbent.net_profit > best_known.net_profit - epsilon) And (incumbent.total_volume < best_known.total_volume - epsilon)) Then

            best_known = incumbent
            
        End If
        
    Next i
    
    'GoTo CLP_Solver_Finish
    
    'end_time = Timer
    'MsgBox "Constructive phase result: " & best_known.net_profit & " time: " & end_time - start_time
    
    'improvement phase

    iteration = 0

    Do
        DoEvents
        
        If (solver_options.show_progress = True) And (iteration Mod 100 = 0) Then
            Application.ScreenUpdating = True
            If best_known.feasible = True Then
                Application.StatusBar = "Starting iteration " & iteration & ". Best net profit found so far: " & best_known.net_profit & " Dispersion: " & best_known.total_distance
            Else
                Application.StatusBar = "Starting iteration " & iteration & ". Best net profit found so far: N/A" & " Dispersion: " & best_known.total_distance
            End If
            Application.ScreenUpdating = False
        End If

        If Rnd < 0.5 Then ' < ((end_time - start_time) / solver_options.CPU_time_limit) ^ 2 Then

             incumbent = best_known

        End If
        
        With incumbent
        
            For i = 1 To .num_containers
                Call PerturbSolution(incumbent, i, 1 - ((end_time - start_time) / solver_options.CPU_time_limit))
            Next i
            
        End With
        
        Call SortContainers(incumbent, 0.2)

        With incumbent
        
            For i = 1 To .num_containers
    
                For j = 1 To item_list.num_item_types
                    
                    continue_flag = True
                    Do While (.unpacked_item_count(.item_type_order(j)) > 0) And (continue_flag = True)
                        continue_flag = AddItemToContainer(incumbent, i, .item_type_order(j), 1, False)
                        DoEvents
                    Loop
                Next j
    
                .feasible = True
                For j = 1 To item_list.num_item_types
                    If (.unpacked_item_count(j) > 0) And (item_list.item_types(j).mandatory = 1) Then
                        .feasible = False
                        Exit For
                    End If
                Next j
                
                Call CalculateDispersion(incumbent)
                
                If ((.feasible = True) And (best_known.feasible = False)) Or _
                   ((.feasible = False) And (best_known.feasible = False) And (.total_volume > best_known.total_volume + epsilon)) Or _
                   ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit + epsilon)) Or _
                   ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume - epsilon)) Or _
                   ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance - epsilon) Or _
                   ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance + epsilon) And (.total_x_moment < best_known.total_x_moment - epsilon) Or _
                   ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance + epsilon) And (.total_x_moment < best_known.total_x_moment + epsilon) And (.total_yz_moment < best_known.total_yz_moment - epsilon) Then
        
                    best_known = incumbent
                    
                End If
    
            Next i
            
        End With

        iteration = iteration + 1
        
        end_time = Timer
        
        If end_time < start_time - 0.01 Then
            solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
            start_time = end_time
        End If
        
    Loop While end_time - start_time < solver_options.CPU_time_limit / 3
    
    ' reorganize now

    Call CalculateDistance(best_known)

    nonempty_container_cnt = 0
    With best_known
        For i = 1 To .num_containers

            If .container(i).item_cnt > 0 Then
                nonempty_container_cnt = nonempty_container_cnt + 1
            End If

        Next i
    End With

    For container_id = 1 To best_known.num_containers

        Application.ScreenUpdating = True
        If best_known.feasible = True Then
            Application.StatusBar = "Reorganizing container " & container_id & ". Best net profit found so far: " & best_known.net_profit & " Distance: " & best_known.total_distance
        Else
            Application.StatusBar = "Reorganizing container " & container_id & ". Best net profit found so far: N/A" & " Distance: " & best_known.total_distance
        End If
        Application.ScreenUpdating = False

        If best_known.container(container_id).item_cnt > 0 Then

            incumbent = best_known

            start_time = Timer
            end_time = Timer

            Do
                DoEvents

                Call PerturbSolution(incumbent, container_id, 0.1 + 0.2 * ((end_time - start_time) / ((solver_options.CPU_time_limit * 0.666) / nonempty_container_cnt)))

                With incumbent

                    For j = 1 To item_list.num_item_types

                        continue_flag = True
                        Do While (.unpacked_item_count(.item_type_order(j)) > 0) And (continue_flag = True)
                            continue_flag = AddItemToContainer(incumbent, container_id, .item_type_order(j), 1, True)
                            DoEvents
                        Loop
                    Next j

                    .feasible = True
                    For j = 1 To item_list.num_item_types
                        If (.unpacked_item_count(j) > 0) And (item_list.item_types(j).mandatory = 1) Then
                            .feasible = False
                            Exit For
                        End If
                    Next j

                    Call CalculateDistance(incumbent)

                    If ((.feasible = True) And (best_known.feasible = False)) Or _
                       ((.feasible = False) And (best_known.feasible = False) And (.total_volume > best_known.total_volume + epsilon)) Or _
                       ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit + epsilon)) Or _
                       ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume - epsilon)) Or _
                       ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance - epsilon) Or _
                       ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance + epsilon) And (.total_x_moment < best_known.total_x_moment - epsilon) Or _
                       ((.feasible = True) And (best_known.feasible = True) And (.net_profit > best_known.net_profit - epsilon) And (.total_volume < best_known.total_volume + epsilon)) And (.total_distance < best_known.total_distance + epsilon) And (.total_x_moment < best_known.total_x_moment + epsilon) And (.total_yz_moment < best_known.total_yz_moment - epsilon) Then
            
                        best_known = incumbent
                        
'                        If best_known.feasible = True Then
'                            Application.StatusBar = "Reorganizing container " & container_id & ". Best net profit found so far: " & best_known.net_profit & " Distance: " & best_known.total_distance
'                        Else
'                            Application.StatusBar = "Reorganizing container " & container_id & ". Best net profit found so far: N/A" & " Distance: " & best_known.total_distance
'                        End If
                        
                    End If

                End With

                end_time = Timer
                
                If end_time < start_time - 0.01 Then
                    solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
                    start_time = end_time
                End If

            Loop While end_time - start_time < (solver_options.CPU_time_limit * 0.666) / nonempty_container_cnt

        End If

    Next container_id

    'MsgBox "Iterations performed: " & iteration
    
CLP_Solver_Finish:
    
    'ensure loadability

    Dim min_x As Double
    Dim min_y As Double
    Dim min_z As Double

    Dim intersection_right As Double
    Dim intersection_left As Double
    Dim intersection_top As Double
    Dim intersection_bottom As Double

    Dim selected_item_index As Long
    Dim swap_item As item_in_container

    Dim area_supported As Double
    Dim area_required As Double
    Dim support_flag As Boolean

    For i = 1 To best_known.num_containers

        With best_known.container(i)

            For j = 1 To .item_cnt

                selected_item_index = 0
                min_x = .width
                min_y = .height
                min_z = .length
                
                For k = j To .item_cnt

                    If (.items(k).origin_z < min_z - epsilon) Or _
                        ((.items(k).origin_z < min_z + epsilon) And (.items(k).origin_y < min_y - epsilon)) Or _
                        ((.items(k).origin_z < min_z + epsilon) And (.items(k).origin_y < min_y + epsilon) And (.items(k).origin_x < min_x - epsilon)) Then

                        'check for support
                    
                        If .items(k).origin_y < epsilon Then
                            support_flag = True
                        Else
                            area_supported = 0
                            area_required = ((.items(k).opposite_x - .items(k).origin_x) * (.items(k).opposite_z - .items(k).origin_z))
                            support_flag = False
                            For l = j - 1 To 1 Step -1
                                        
                                If (Abs(.items(k).origin_y - .items(l).opposite_y) < epsilon) Then
                                    
                                    'check for intersection
                                    
                                    intersection_right = .items(k).opposite_x
                                    If intersection_right > .items(l).opposite_x Then intersection_right = .items(l).opposite_x
                                    
                                    intersection_left = .items(k).origin_x
                                    If intersection_left < .items(l).origin_x Then intersection_left = .items(l).origin_x
                                    
                                    intersection_top = .items(k).opposite_z
                                    If intersection_top > .items(l).opposite_z Then intersection_top = .items(l).opposite_z
                                    
                                    intersection_bottom = .items(k).origin_z
                                    If intersection_bottom < .items(l).origin_z Then intersection_bottom = .items(l).origin_z
                                    
                                    If (intersection_right > intersection_left) And (intersection_top > intersection_bottom) Then
                                        area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom)
                                        If area_supported > area_required - epsilon Then
                                            support_flag = True
                                            Exit For
                                        End If
                                    End If
                                    
                                End If
                            Next l
                            
                        End If
                        
                        If support_flag = True Then
                            selected_item_index = k

                            min_x = .items(k).origin_x
                            min_y = .items(k).origin_y
                            min_z = .items(k).origin_z
                        End If
                    End If
                
                Next k

                If selected_item_index > 0 Then
                    swap_item = .items(selected_item_index)
                    .items(selected_item_index) = .items(j)
                    .items(j) = swap_item
                Else
                    MsgBox ("Loading order could not be constructed.")
                End If
            Next j

        End With
    Next i
        
    'write the solution
    
    'MsgBox best_known.total_distance
    
    If best_known.feasible = True Then
        reply = MsgBox("CLP Spreadsheet Solver performed " & iteration & " LNS iterations and found a solution with a net profit of " & best_known.net_profit & ". Do you want to overwrite the current solution with the best found solution?", vbYesNo, "CLP Spreadsheet Solver")
        If reply = vbYes Then
            Call WriteSolution(best_known)
        End If
    ElseIf infeasibility_count > 0 Then
        Call WriteSolution(best_known)
    Else
        reply = MsgBox("The best found solution after " & iteration & " LNS iterations does not satisfy all constraints. Do you want to overwrite the current solution with the best found solution?", vbYesNo, "CLP Spreadsheet Solver")
        If reply = vbYes Then
            Call WriteSolution(best_known)
        End If
    End If
    
    'Erase the data
    
    Erase item_list.item_types
    Erase container_list.container_types
    Erase compatibility_list.item_to_item
    Erase compatibility_list.container_to_item

    For i = 1 To incumbent.num_containers
        Erase incumbent.container(i).items
    Next i
    Erase incumbent.container
    Erase incumbent.unpacked_item_count
    
    For i = 1 To best_known.num_containers
        Erase best_known.container(i).items
    Next i
    Erase best_known.container
    Erase best_known.unpacked_item_count
    
    Application.StatusBar = False
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
    ThisWorkbook.Worksheets("3.Solution").Activate
    Cells(1, 1).Select
    
End Sub
Sub FeasibilityCheckData(infeasibility_count As Long, infeasibility_string As String)
    
    Dim i As Long
    Dim j As Long
    Dim feasibility_flag As Boolean
    
    infeasibility_count = 0
    infeasibility_string = vbNullString
    
    Range(ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 9, 1), ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + (4 * item_list.total_number_of_items), 1)).Clear
    
    Dim volume_capacity_required As Double
    Dim volume_capacity_available As Double
    
    Dim weight_capacity_required As Double
    Dim weight_capacity_available As Double
    
    Dim max_width As Double
    Dim max_heigth As Double
    Dim max_length As Double
    
    volume_capacity_required = 0
    volume_capacity_available = 0
    
    weight_capacity_required = 0
    weight_capacity_available = 0
    
    max_width = 0
    max_heigth = 0
    max_length = 0
    
    With item_list
        For i = 1 To .num_item_types
            If .item_types(i).mandatory = 1 Then
                volume_capacity_required = volume_capacity_required + (.item_types(i).volume * .item_types(i).number_requested)
                weight_capacity_required = weight_capacity_required + (.item_types(i).weight * .item_types(i).number_requested)
            End If
        Next i
    End With
    
    With container_list
        For i = 1 To .num_container_types
            If .container_types(i).mandatory >= 0 Then
                
                volume_capacity_available = volume_capacity_available + (.container_types(i).volume_capacity * .container_types(i).number_available)
                weight_capacity_available = weight_capacity_available + (.container_types(i).weight_capacity * .container_types(i).number_available)
                
                If .container_types(i).width > max_width Then max_width = .container_types(i).width
                If .container_types(i).height > max_heigth Then max_heigth = .container_types(i).height
                If .container_types(i).length > max_length Then max_length = .container_types(i).length
                
            End If
        Next i
    End With
    
    If volume_capacity_required > volume_capacity_available + epsilon Then
        infeasibility_count = infeasibility_count + 1
        infeasibility_string = infeasibility_string & "The amount of available volume is not enough to pack the mandatory items." & Chr(13)
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available volume is not enough to pack the mandatory items."
    End If
    
    If weight_capacity_required > weight_capacity_available + epsilon Then
        infeasibility_count = infeasibility_count + 1
        infeasibility_string = infeasibility_string & "The amount of available weight capacity is not enough to pack the mandatory items." & Chr(13)
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available weight capacity is not enough to pack the mandatory items."
    End If
    
    With item_list
        For i = 1 To .num_item_types
            With .item_types(i)
                If (.mandatory = 1) And (.xy_rotatable = False) And (.yz_rotatable = False) And ((.width > max_width + epsilon) Or (.height > max_heigth + epsilon) Or (.length > max_length + epsilon)) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too large to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too large to fit into any container."
                End If

                If (.mandatory = 1) And (.width > max_width + epsilon) And (.width > max_heigth + epsilon) And (.width > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too wide to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too wide to fit into any container."
                End If

                If (.mandatory = 1) And (.height > max_width + epsilon) And (.height > max_heigth + epsilon) And (.height > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too tall to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too tall to fit into any container."
                End If
                
                If (.mandatory = 1) And (.length > max_width + epsilon) And (.length > max_heigth + epsilon) And (.length > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too long to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too long to fit into any container."
                End If
            End With
        Next i
    End With
    
    If instance.container_item_compatibility_worksheet = True Then
    
        For i = 1 To item_list.num_item_types
            
            feasibility_flag = False
            
            For j = 1 To container_list.num_container_types
                If compatibility_list.container_to_item(j, i) = True Then
                    feasibility_flag = True
                    Exit For
                End If
            Next j
            
            If feasibility_flag = False Then
                
                infeasibility_count = infeasibility_count + 1
                If infeasibility_count < 5 Then
                    infeasibility_string = infeasibility_string & "Item type " & i & " is not compatible with any container." & Chr(13)
                End If
                If infeasibility_count = 5 Then
                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                End If
                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is not compatible with any container."
            End If
            
        Next i
    End If
    
End Sub
Sub FeasibilityCheckDataAndSolution()
    
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    Dim WorksheetExists As Boolean
    Dim reply As Integer
    
    WorksheetExists = CheckWorksheetExistence("1.Items") And CheckWorksheetExistence("2.Containers") And CheckWorksheetExistence("3.Solution")
    If WorksheetExists = False Then
        MsgBox "Worksheets 1.Items, 2.Containers, and 3.Solution must exist for the Feasibility Check."
        Exit Sub
    End If
    
    Call GetItemData
    Call GetContainerData
    Call GetInstanceData
    Call GetCompatibilityData

    ThisWorkbook.Worksheets("3.Solution").Activate
    
    Range(Cells(2, 1), Cells(2, 11)).Clear
    Range(ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 9, 1), ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + (4 * item_list.total_number_of_items), 1)).Clear
    
    Dim infeasibility_count As Long
    infeasibility_count = 0
    
    Dim infeasibility_string As String
    infeasibility_string = vbNullString
    
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    Dim container_index As Long
        
    Dim offset As Long
    Dim container_name As String
    Dim feasibility_flag As Boolean
        
    Dim incumbent As solution_data
    
    Call InitializeSolution(incumbent)
    Call ReadSolution(incumbent)
    
    Dim volume_capacity_required As Double
    Dim volume_capacity_available As Double
    
    Dim weight_capacity_required As Double
    Dim weight_capacity_available As Double
    
    Dim area_supported As Double
    Dim intersection_right As Double
    Dim intersection_left As Double
    Dim intersection_top As Double
    Dim intersection_bottom As Double
    
    Dim max_width As Double
    Dim max_heigth As Double
    Dim max_length As Double
    
    volume_capacity_required = 0
    volume_capacity_available = 0
    
    weight_capacity_required = 0
    weight_capacity_available = 0
    
    max_width = 0
    max_heigth = 0
    max_length = 0
    
    With item_list
        For i = 1 To .num_item_types
            If .item_types(i).mandatory = 1 Then
                volume_capacity_required = volume_capacity_required + (.item_types(i).volume * .item_types(i).number_requested)
                weight_capacity_required = weight_capacity_required + (.item_types(i).weight * .item_types(i).number_requested)
            End If
        Next i
    End With
    
    With container_list
        For i = 1 To .num_container_types
            If .container_types(i).mandatory >= 0 Then
                
                volume_capacity_available = volume_capacity_available + (.container_types(i).volume_capacity * .container_types(i).number_available)
                weight_capacity_available = weight_capacity_available + (.container_types(i).weight_capacity * .container_types(i).number_available)
                
                If .container_types(i).width > max_width Then max_width = .container_types(i).width
                If .container_types(i).height > max_heigth Then max_heigth = .container_types(i).height
                If .container_types(i).length > max_length Then max_length = .container_types(i).length
                
            End If
        Next i
    End With
    
    If volume_capacity_required > volume_capacity_available + epsilon Then
        infeasibility_count = infeasibility_count + 1
        infeasibility_string = infeasibility_string & "The amount of available volume is not enough to pack the mandatory items." & Chr(13)
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available volume is not enough to pack the mandatory items."
    End If
    
    If weight_capacity_required > weight_capacity_available + epsilon Then
        infeasibility_count = infeasibility_count + 1
        infeasibility_string = infeasibility_string & "The amount of available weight capacity is not enough to pack the mandatory items." & Chr(13)
        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available weight capacity is not enough to pack the mandatory items."
    End If
    
    With item_list
        For i = 1 To .num_item_types
            With .item_types(i)
                If (.mandatory = 1) And (.xy_rotatable = False) And (.yz_rotatable = False) And ((.width > max_width + epsilon) Or (.height > max_heigth + epsilon) Or (.length > max_length + epsilon)) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too large to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too large to fit into any container."
                End If

                If (.mandatory = 1) And (.width > max_width + epsilon) And (.width > max_heigth + epsilon) And (.width > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too wide to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too wide to fit into any container."
                End If

                If (.mandatory = 1) And (.height > max_width + epsilon) And (.height > max_heigth + epsilon) And (.height > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too tall to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too tall to fit into any container."
                End If
                
                If (.mandatory = 1) And (.length > max_width + epsilon) And (.length > max_heigth + epsilon) And (.length > max_length + epsilon) Then
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "Item type " & i & " is too long to fit into any container." & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is too long to fit into any container."
                End If
            End With
        Next i
    End With
    
    offset = 0
    For i = 1 To container_list.num_container_types
        For j = 1 To container_list.container_types(i).number_available
            If container_list.container_types(i).mandatory = -1 Then
                
                feasibility_flag = True
                For k = 1 To item_list.total_number_of_items
                    If ThisWorkbook.Worksheets("3.Solution").Cells(5 + k, offset + 2) <> vbNullString Then
                        feasibility_flag = False
                        Exit For
                    End If
                Next k
                
                If feasibility_flag = False Then
                
                    infeasibility_count = infeasibility_count + 1
                    If infeasibility_count < 5 Then
                        infeasibility_string = infeasibility_string & "There are item(s) in the unavailable " & ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1) & Chr(13)
                    End If
                    If infeasibility_count = 5 Then
                        infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                    End If
                    ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "There are item(s) in the unavailable " & ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)
                    
                End If
            End If
            
            offset = offset + 11
        Next j
    Next i
    
    offset = 0
    container_index = 1
    For i = 1 To container_list.num_container_types
    
        For j = 1 To container_list.container_types(i).number_available
                
            If container_list.container_types(i).mandatory >= 0 Then

                For k = 1 To incumbent.container(container_index).item_cnt
                
                    If ((incumbent.container(container_index).items(k).rotation = 3) Or (incumbent.container(container_index).items(k).rotation = 4)) And (item_list.item_types(incumbent.container(container_index).items(k).item_type).xy_rotatable = False) Then

                        container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)

                        infeasibility_count = infeasibility_count + 1
                        If infeasibility_count < 5 Then
                            infeasibility_string = infeasibility_string & "Item " & k & " in " & container_name & " is placed on its xy surface, which is not allowed." & Chr(13)
                        End If
                        If infeasibility_count = 5 Then
                            infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                        End If
                        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item " & k & " in " & container_name & " is placed on its xy surface, which is not allowed."

                    End If
                    
                    If ((incumbent.container(container_index).items(k).rotation = 5) Or (incumbent.container(container_index).items(k).rotation = 6)) And (item_list.item_types(incumbent.container(container_index).items(k).item_type).yz_rotatable = False) Then

                        container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)

                        infeasibility_count = infeasibility_count + 1
                        If infeasibility_count < 5 Then
                            infeasibility_string = infeasibility_string & "Item " & k & " in " & container_name & " is placed on its yz surface, which is not allowed." & Chr(13)
                        End If
                        If infeasibility_count = 5 Then
                            infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                        End If
                        ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item " & k & " in " & container_name & " is placed on its yz surface, which is not allowed."

                    End If
                Next k
                
                container_index = container_index + 1
            End If
            
            offset = offset + 11
        
        Next j
        
    Next i
    
    With incumbent
        For i = 1 To item_list.num_item_types
            If (item_list.item_types(i).mandatory = 1) And (.unpacked_item_count(i) > 0) Then
            
                infeasibility_count = infeasibility_count + 1
                If infeasibility_count < 5 Then
                    infeasibility_string = infeasibility_string & "There are " & .unpacked_item_count(i) & " item(s) of type " & ThisWorkbook.Worksheets("1.Items").Cells(2 + i, 2) & " that are not packed in the available containers." & Chr(13)
                End If
                If infeasibility_count = 5 Then
                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                End If
                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "There are " & .unpacked_item_count(i) & " item(s) of type " & ThisWorkbook.Worksheets("1.Items").Cells(2 + i, 2) & " that are not packed in the available containers."
                
            End If
            
            If .unpacked_item_count(i) < 0 Then
            
                infeasibility_count = infeasibility_count + 1
                If infeasibility_count < 5 Then
                    infeasibility_string = infeasibility_string & "Too many item(s) of type " & ThisWorkbook.Worksheets("1.Items").Cells(2 + i, 2) & " are packed." & Chr(13)
                End If
                If infeasibility_count = 5 Then
                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                End If
                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Too many item(s) of type " & ThisWorkbook.Worksheets("1.Items").Cells(2 + i, 2) & " are packed."
                
            End If
        Next i
    End With
    
    If instance.container_item_compatibility_worksheet = True Then
    
        For i = 1 To item_list.num_item_types
            
            feasibility_flag = False
            
            For j = 1 To container_list.num_container_types
                If compatibility_list.container_to_item(j, i) = True Then
                    feasibility_flag = True
                    Exit For
                End If
            Next j
            
            If feasibility_flag = False Then
                
                infeasibility_count = infeasibility_count + 1
                If infeasibility_count < 5 Then
                    infeasibility_string = infeasibility_string & "Item type " & i & " is not compatible with any container." & Chr(13)
                End If
                If infeasibility_count = 5 Then
                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                End If
                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " & i & " is not compatible with any container."
            End If
            
        Next i
        
    End If
        
    If instance.item_item_compatibility_worksheet = True Then
    
        offset = 0
        container_index = 1
        For i = 1 To container_list.num_container_types
        
            For j = 1 To container_list.container_types(i).number_available
                    
                If container_list.container_types(i).mandatory >= 0 Then

                    For k = 1 To incumbent.container(container_index).item_cnt
                    
                        For l = k + 1 To incumbent.container(container_index).item_cnt
                            
                            If compatibility_list.item_to_item(incumbent.container(container_index).items(k).item_type, incumbent.container(container_index).items(l).item_type) = False Then
                                
                                container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)
                                
                                infeasibility_count = infeasibility_count + 1
                                If infeasibility_count < 5 Then
                                    infeasibility_string = infeasibility_string & "Items " & k & " and " & l & " in " & container_name & " are incompatible." & Chr(13)
                                End If
                                If infeasibility_count = 5 Then
                                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                                End If
                                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Items " & k & " and " & l & " in " & container_name & " are incompatible."
                            
                            End If
                            
                        Next l
                    Next k
                    
                    container_index = container_index + 1
                End If
                
                offset = offset + 11
            
            Next j
            
        Next i
        
    End If
    
    
    offset = 0
    container_index = 1
    For i = 1 To container_list.num_container_types
    
        For j = 1 To container_list.container_types(i).number_available
                
            If container_list.container_types(i).mandatory >= 0 Then

                With incumbent.container(container_index)
            
                    For k = 1 To incumbent.container(container_index).item_cnt
                    
                        If (.items(k).opposite_x > container_list.container_types(i).width + epsilon) Or (.items(k).opposite_y > container_list.container_types(i).height + epsilon) Or (.items(k).opposite_z > container_list.container_types(i).length + epsilon) Then
                            container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)
                                
                            infeasibility_count = infeasibility_count + 1
                            If infeasibility_count < 5 Then
                                infeasibility_string = infeasibility_string & "Item " & k & " in " & container_name & " is out of the bounds of the container." & Chr(13)
                            End If
                            If infeasibility_count = 5 Then
                                infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                            End If
                            ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item " & k & " in " & container_name & " is out of the bounds of the container."
                        End If
                    
                        For l = k + 1 To incumbent.container(container_index).item_cnt
                                
                            If (.items(k).opposite_x < .items(l).origin_x + epsilon) Or _
                                (.items(l).opposite_x < .items(k).origin_x + epsilon) Or _
                                (.items(k).opposite_y < .items(l).origin_y + epsilon) Or _
                                (.items(l).opposite_y < .items(k).origin_y + epsilon) Or _
                                (.items(k).opposite_z < .items(l).origin_z + epsilon) Or _
                                (.items(l).opposite_z < .items(k).origin_z + epsilon) Then
                                'no conflict
                            Else
                                'conflict
                                                            
                                container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)
                                
                                infeasibility_count = infeasibility_count + 1
                                If infeasibility_count < 5 Then
                                    infeasibility_string = infeasibility_string & "Items " & k & " and " & l & " in " & container_name & " are overlapping." & Chr(13)
                                End If
                                If infeasibility_count = 5 Then
                                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                                End If
                                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Items " & k & " and " & l & " in " & container_name & " are overlapping."
                            End If
                            
                        Next l
                    Next k
                                        
                End With

                container_index = container_index + 1
            End If
            
            offset = offset + 11
        
        Next j
        
    Next i
    
    'support
    
    offset = 0
    container_index = 1
    For i = 1 To container_list.num_container_types
    
        For j = 1 To container_list.container_types(i).number_available
                
            If container_list.container_types(i).mandatory >= 0 Then

                With incumbent.container(container_index)
            
                    For k = 1 To incumbent.container(container_index).item_cnt
                        
                        If .items(k).origin_y < epsilon Then
                            'supported by the floor
                        Else
                            area_supported = 0
                            For l = 1 To incumbent.container(container_index).item_cnt
                                
                                If (Abs(.items(k).origin_y - .items(l).opposite_y) < epsilon) Then
                                    
                                    'check for intersection
                                    
                                    intersection_right = .items(k).opposite_x
                                    If intersection_right > .items(l).opposite_x Then intersection_right = .items(l).opposite_x
                                    
                                    intersection_left = .items(k).origin_x
                                    If intersection_left < .items(l).origin_x Then intersection_left = .items(l).origin_x
                                    
                                    intersection_top = .items(k).opposite_z
                                    If intersection_top > .items(l).opposite_z Then intersection_top = .items(l).opposite_z
                                    
                                    intersection_bottom = .items(k).origin_z
                                    If intersection_bottom < .items(l).origin_z Then intersection_bottom = .items(l).origin_z
                                    
                                    If (intersection_right > intersection_left) And (intersection_top > intersection_bottom) Then
                                        area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom)
                                    End If
                                End If
                            Next l
                            
                            If area_supported < (.items(k).opposite_x - .items(k).origin_x) * (.items(k).opposite_z - .items(k).origin_z) - epsilon Then
                                
                                'infeasible
                                
                                container_name = ThisWorkbook.Worksheets("3.Solution").Cells(3, offset + 1)
                                
                                infeasibility_count = infeasibility_count + 1
                                If infeasibility_count < 5 Then
                                    infeasibility_string = infeasibility_string & "Item " & k & " in " & container_name & " is not supported. " & area_supported & " " & (.items(k).opposite_x - .items(k).origin_x) * (.items(k).opposite_z - .items(k).origin_z) & Chr(13)
                                End If
                                If infeasibility_count = 5 Then
                                    infeasibility_string = infeasibility_string & "More can be found in the list of detected infeasibilities in the solution worksheet." & Chr(13)
                                End If
                                ThisWorkbook.Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item " & k & " in " & container_name & " is not supported."
                                
                            End If
                            
                        End If
                        
                    Next k
                                        
                End With

                container_index = container_index + 1
            End If
            
            offset = offset + 11
        
        Next j
        
    Next i
            
    If infeasibility_count > 0 Then
        Cells(2, 1) = "Warning: Last infeasibility check found problems with the solution."
        Range(Cells(2, 1), Cells(2, 10)).Interior.ColorIndex = 45
        Range(Cells(2, 1), Cells(2, 10)).Font.Bold = True
        infeasibility_string = infeasibility_string & "The solution is infeasible."
        MsgBox (infeasibility_string)
        Cells(7 + item_list.total_number_of_items, 1).Select
    Else
        MsgBox ("The solution is feasible.")
        Cells(1, 1).Select
    End If
    
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic

End Sub


Private Sub SortItems()

    Dim i As Long
    Dim j As Long
    
    Dim swap_item_type As item_type_data
    
    If item_list.num_item_types > 1 Then
       For i = 1 To item_list.num_item_types
           For j = item_list.num_item_types To 2 Step -1
               If (item_list.item_types(j).mandatory > item_list.item_types(j - 1).mandatory) Or _
                   ((item_list.item_types(j).mandatory = 1) And (item_list.item_types(j - 1).mandatory = 1) And (item_list.item_types(j).sort_criterion > item_list.item_types(j - 1).sort_criterion)) Or _
                   ((item_list.item_types(j).mandatory = 0) And (item_list.item_types(j - 1).mandatory = 0) And ((item_list.item_types(j).profit / item_list.item_types(j).volume) > (item_list.item_types(j - 1).profit / item_list.item_types(j - 1).volume))) Then
                   
                   swap_item_type = item_list.item_types(j)
                   item_list.item_types(j) = item_list.item_types(j - 1)
                   item_list.item_types(j - 1) = swap_item_type
                   
               End If
           Next j
       Next i
    End If
    
'    For i = 1 To item_list.num_item_types
'       MsgBox item_list.item_types(i).id & " " & item_list.item_types(i).weight & " " & item_list.item_types(i).sort_criterion
'    Next i
    
End Sub

Private Sub CalculateDistance(solution As solution_data)

    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim l As Long
    Dim max_z As Double

    With solution
    
        .total_distance = 0
        .total_x_moment = 0
        .total_yz_moment = 0
        
        For j = 1 To .num_containers

             With .container(j)
                 max_z = 0
                 For k = 1 To .item_cnt
                        For l = k + 1 To .item_cnt
                            If .items(k).item_type = .items(l).item_type Then
                                solution.total_distance = solution.total_distance + Abs(.items(k).opposite_x + .items(k).origin_x - .items(l).opposite_x - .items(l).origin_x) + Abs(.items(k).opposite_y + .items(k).origin_y - .items(l).opposite_y - .items(l).origin_y) + Abs(.items(k).opposite_z + .items(k).origin_z - .items(l).opposite_z - .items(l).origin_z)
                            End If

                           'solution.total_distance = solution.total_distance + .items(k).opposite_z
                        Next l

                     If max_z < .items(k).opposite_z Then max_z = .items(k).opposite_z

                    'solution.total_distance = solution.total_distance + penalty * max_z
                    solution.total_distance = solution.total_distance + .items(k).opposite_z

                   ' solution.total_x_moment = solution.total_x_moment + (.items(k).origin_y + .items(k).opposite_y) * item_list.item_types(.items(k).item_type).weight

                 Next k

                 solution.total_distance = solution.total_distance + .item_cnt * .item_cnt * max_z

             End With

        Next j
        

    End With
    
End Sub

Private Sub CalculateDispersion(solution As solution_data)

    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim max_z As Double
    Dim item_flag As Boolean
    Dim container_count As Long
    
    With solution
    
        .total_distance = 0

        For i = 1 To item_list.num_item_types
            container_count = 0
            For j = 1 To .num_containers

                 With .container(j)
                     item_flag = False
                     For k = 1 To .item_cnt
                            If .items(k).item_type = i Then
                                item_flag = True
                                Exit For
                            End If
                     Next k

                     If item_flag = True Then container_count = container_count + 1
                 End With

            Next j

            solution.total_distance = solution.total_distance + container_count * container_count
        Next i
    End With
    
End Sub

' ribbon calls and tab activation

#If Win32 Or Win64 Or (MAC_OFFICE_VERSION >= 15) Then

Sub CLP_Solver_ribbon_call(control As IRibbonControl)
    Call CLP_Solver
End Sub
Sub FeasibilityCheckDataAndSolutionRibbonCall(control As IRibbonControl)
    Call FeasibilityCheckDataAndSolution
End Sub

#End If
