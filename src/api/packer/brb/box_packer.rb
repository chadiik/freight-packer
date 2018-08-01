module BoxPacker
  class << self
    def pack(container:, items:)
      packings = []

      items.each do |item|
        # If the item is just too big for the container lets give up on this
        raise 'Item is too heavy for container' if item[:weight].to_f > container[:weight_limit].to_f

        # Need a bool so we can break out nested loops once it's been packed
        item_has_been_packed = false

        packings.each do |packing|
          # If this packings going to be too big with this
          # item as well then skip on to the next packing
          next if packing[:weight].to_f + item[:weight].to_f > container[:weight_limit].to_f

          packing[:spaces].each do |space|
            # Try placing the item in this space,
            # if it doesn't fit skip on the next space
            next unless placement = place(item, space)

            # Add the item to the packing and
            # break up the surrounding spaces
            packing[:placements] += [placement]
            packing[:weight] += item[:weight].to_f
            packing[:spaces] -= [space]
            packing[:spaces] += break_up_space(space, placement)
            item_has_been_packed = true
            break
          end
          break if item_has_been_packed
        end
        next if item_has_been_packed

        # Can't fit in any of the spaces for the current packings
        # so lets try a new space the size of the container
        space = {
          dimensions: container[:dimensions].sort.reverse,
          position: [0, 0, 0]
        }
        placement = place(item, space)

        # If it can't be placed in this space, then it's just
        # too big for the container and we should abandon hope
        raise 'Item cannot be placed in container' unless placement

        # Otherwise lets put the item in a new packing
        # and break up the remaing free space around it
        packings += [{
          placements: [placement],
          weight: item[:weight].to_f,
          spaces: break_up_space(space, placement)
        }]
      end

      packings
    end

    def place(item, space)
      item_width, item_height, item_length = item[:dimensions].sort.reverse

      permutations = [
        [item_width, item_height, item_length],
        [item_width, item_length, item_height],
        [item_height, item_width, item_length],
        [item_height, item_length, item_width],
        [item_length, item_width, item_height],
        [item_length, item_height, item_width]
      ]

      permutations.each do |perm|
        # Skip if the item does not fit with this orientation
        next unless perm[0] <= space[:dimensions][0] &&
                    perm[1] <= space[:dimensions][1] &&
                    perm[2] <= space[:dimensions][2]

        return {
          dimensions: perm,
          position: space[:position],
          weight: item[:weight].to_f
        }
      end

      return nil
    end

    def break_up_space(space, placement)
      [
        {
          dimensions: [
            space[:dimensions][0] - placement[:dimensions][0],
            space[:dimensions][1],
            space[:dimensions][2]
          ],
          position: [
            space[:position][0] + placement[:dimensions][0],
            space[:position][1],
            space[:position][2]
          ]
        },
        {
          dimensions: [
            placement[:dimensions][0],
            space[:dimensions][1] - placement[:dimensions][1],
            space[:dimensions][2]
          ],
          position: [
            space[:position][0],
            space[:position][1] + placement[:dimensions][1],
            space[:position][2]
          ]
        },
        {
          dimensions: [
            placement[:dimensions][0],
            placement[:dimensions][1],
            space[:dimensions][2] - placement[:dimensions][2]
          ],
          position: [
            space[:position][0],
            space[:position][1],
            space[:position][2] + placement[:dimensions][2]
          ]
        }
      ]
    end
  end
end
