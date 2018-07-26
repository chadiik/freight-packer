import Container from "./components/Container";
import Item from "./components/Item";

const epsilon = Math.pow(2, -52);;

/**
 * From the master's thesis:
 * "The double linked list we use keeps the topology of the edge of the 
 * current layer under construction. We keep the x and z coordinates of 
 * each gap's right corner. The program looks at those gaps and tries to 
 * fill them with boxes one at a time while trying to keep the edge of the
 * layer even" (p. 3-7).
 */
class ScrapPad{
    constructor(){
        /** The x coordinate of the gap's right corner. */
        this.CumX = 0;
        /** The z coordinate of the gap's right corner. */
        this.CumZ = 0;
        
        /** The following entry.
         * @type {ScrapPad}
         */
        this.Post;

        /** The previous entry.
         * @type {ScrapPad}
         */
        this.Pre;
    }
}

/**
 * A list that stores all the different lengths of all item dimensions.
 * From the master's thesis:
 * "Each Layerdim value in this array represents a different layer thickness
 * value with which each iteration can start packing. Before starting iterations,
 * all different lengths of all box dimensions along with evaluation values are
 * stored in this array" (p. 3-6).
 */
class Layer {
    constructor(layerEval){
        this.LayerDim = 0;
        this.LayerEval = layerEval !== undefined ? layerEval : 0;
    }

    /**
     * @param {Layer} l1 
     * @param {Layer} l2 
     */
    static SortByEval(l1, l2){
        return l1.LayerEval - l2.LayerEval;
    }
}

/**
 * @typedef PackingResult
 * @property {Container} Container
 * @property {Boolean} IsCompletePack
 * @property {Array<Item>} PackedItems
 * @property {Number} PercentContainerVolumePacked
 * @property {Number} PercentItemVolumePacked
 * @property {Array<Item>} UnpackedItems
 * @property {Number} PackTimeInMilliseconds
 */

class PackingResult{
    constructor(){
		/** @type {Container} */
		this.Container;
        this.IsCompletePack = false;
        /** @type {Array<Item>} */
        this.PackedItems = [];
        this.PercentContainerVolumePacked = 0;
        this.PercentItemVolumePacked = 0;
        /** @type {Array<Item>} */
        this.UnpackedItems = [];
        this.PackTimeInMilliseconds = Number.MAX_SAFE_INTEGER;
    }
}


/** @type {Array<Item>} */
var itemsToPack = [];
/** @type {Array<Item>} */
var itemsPackedInOrder;
/** @type {Array<Layer>} */
var layers;

/** @type {ScrapPad} */
var scrapfirst;
/** @type {ScrapPad} */
var smallestZ;
/** @type {ScrapPad} */
var trash;

var evened = false;
var hundredPercentPacked = false
var layerDone = false;
var packing = false;
var packingBest = false;
var quit = false;

var bboxi = 0;
var bestIteration = 0;
var bestVariant = 0;
var boxi = 0;
var cboxi = 0;
var layerListLen = 0;
var packedItemCount = 0;
var x = 0;

var bbfx = 0;
var bbfy = 0;
var bbfz = 0;
var bboxx = 0;
var bboxy = 0;
var bboxz = 0;
var bfx = 0;
var bfy = 0;
var bfz = 0;
var boxx = 0;
var boxy = 0;
var boxz = 0;
var cboxx = 0;
var cboxy = 0;
var cboxz = 0;
var layerinlayer = 0;
var layerThickness = 0;
var lilz = 0;
var packedVolume = 0;
var packedy = 0;
var prelayer = 0;
var prepackedy = 0;
var preremainpy = 0;
var px = 0;
var py = 0;
var pz = 0;
var remainpy = 0;
var remainpz = 0;
var itemsToPackCount = 0;
var totalItemVolume = 0;
var totalContainerVolume = 0;

/**
 * Current port by chadiik (2018)
 * A 3D bin packing algorithm originally ported from https://github.com/davidmchapman/3DContainerPacking
 * which itself was ported from https://github.com/keremdemirer/3dbinpackingjs,
 * which itself was a JavaScript port of https://github.com/wknechtel/3d-bin-pack/, which is a C reconstruction 
 * of a novel algorithm developed in a U.S. Air Force master's thesis by Erhan Baltacioglu in 2001.
 */
class AFit {
    constructor(){

    }
    
    /**
     * Runs the algorithm
     * @param {Container} container 
     * @param {Array<Item>} items 
     * @returns {PackingResult}
     */
    Solve(container, items)
    {
        this.Initialize(container, items);
        this.ExecuteIterations(container);
        this.Report(container);

		var result = new PackingResult();
		result.Container = container;

        for (var i = 1; i <= itemsToPackCount; i++)
        {
            itemsToPack[i].Quantity = 1;

            if (!itemsToPack[i].IsPacked)
            {
                result.UnpackedItems.push(itemsToPack[i]);
            }
        }

        result.PackedItems = itemsPackedInOrder;
        


        if (result.UnpackedItems.length == 0)
        {
            result.IsCompletePack = true;
        }

        return result;
    }

    /**
     * Analyzes each unpacked box to find the best fitting one to the empty space given.
     * @param {Number} hmx 
     * @param {Number} hy 
     * @param {Number} hmy 
     * @param {Number} hz 
     * @param {Number} hmz 
     * @param {Number} dim1 
     * @param {Number} dim2 
     * @param {Number} dim3 
     */
    AnalyzeBox(hmx, hy, hmy, hz, hmz, dim1, dim2, dim3)
	{
		if (dim1 <= hmx && dim2 <= hmy && dim3 <= hmz)
		{
			if (dim2 <= hy)
			{
				if (hy - dim2 < bfy)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
				else if (hy - dim2 == bfy && hmx - dim1 < bfx)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
				else if (hy - dim2 == bfy && hmx - dim1 == bfx && Math.abs(hz - dim3) < bfz)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
			}
			else
			{
				if (dim2 - hy < bbfy)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
				else if (dim2 - hy == bbfy && hmx - dim1 < bbfx)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
				else if (dim2 - hy == bbfy && hmx - dim1 == bbfx && Math.abs(hz - dim3) < bbfz)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
			}
		}
	}

    /**
     * After finding each box, the candidate boxes and the condition of the layer are examined.
     */
	CheckFound()
	{
		evened = false;

		if (boxi != 0)
		{
			cboxi = boxi;
			cboxx = boxx;
			cboxy = boxy;
			cboxz = boxz;
		}
		else
		{
			if ((bboxi > 0) && (layerinlayer != 0 || (!smallestZ.Pre && !smallestZ.Post)))
			{
				if (layerinlayer == 0)
				{
					prelayer = layerThickness;
					lilz = smallestZ.CumZ;
				}

				cboxi = bboxi;
				cboxx = bboxx;
				cboxy = bboxy;
				cboxz = bboxz;
				layerinlayer = layerinlayer + bboxy - layerThickness;
				layerThickness = bboxy;
			}
			else
			{
				if (!smallestZ.Pre && !smallestZ.Post)
				{
					layerDone = true;
				}
				else
				{
					evened = true;

					if (!smallestZ.Pre)
					{
						trash = smallestZ.Post;
						smallestZ.CumX = smallestZ.Post.CumX;
						smallestZ.CumZ = smallestZ.Post.CumZ;
						smallestZ.Post = smallestZ.Post.Post;
						if (smallestZ.Post)
						{
							smallestZ.Post.Pre = smallestZ;
						}
					}
					else if (!smallestZ.Post)
					{
						smallestZ.Pre.Post = undefined;
						smallestZ.Pre.CumX = smallestZ.CumX;
					}
					else
					{
						if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ)
						{
							smallestZ.Pre.Post = smallestZ.Post.Post;

							if (smallestZ.Post.Post)
							{
								smallestZ.Post.Post.Pre = smallestZ.Pre;
							}

							smallestZ.Pre.CumX = smallestZ.Post.CumX;
						}
						else
						{
							smallestZ.Pre.Post = smallestZ.Post;
							smallestZ.Post.Pre = smallestZ.Pre;

							if (smallestZ.Pre.CumZ < smallestZ.Post.CumZ)
							{
								smallestZ.Pre.CumX = smallestZ.CumX;
							}
						}
					}
				}
			}
		}
	}

    /**
     * Executes the packing algorithm variants.
     * @param {Container} container 
     */
	ExecuteIterations(container)
	{
		var itelayer = 0;
		var layersIndex = 0;
		var bestVolume = 0;

		for (var containerOrientationVariant = 1; (containerOrientationVariant <= 6) && !quit; containerOrientationVariant++)
		{
			switch (containerOrientationVariant)
			{
				case 1:
					px = container.Length; py = container.Height; pz = container.Width;
					break;

				case 2:
					px = container.Width; py = container.Height; pz = container.Length;
					break;

				case 3:
					px = container.Width; py = container.Length; pz = container.Height;
					break;

				case 4:
					px = container.Height; py = container.Length; pz = container.Width;
					break;

				case 5:
					px = container.Length; py = container.Width; pz = container.Height;
					break;

				case 6:
					px = container.Height; py = container.Width; pz = container.Length;
					break;
			}

			layers.push(new Layer(-1));
			this.ListCanditLayers();
            //layers = layers.OrderBy(l => l.LayerEval).ToList();
            layers.sort(Layer.SortByEval);

			for (layersIndex = 1; (layersIndex <= layerListLen) && !quit; layersIndex++)
			{
				packedVolume = 0;
				packedy = 0;
				packing = true;
				layerThickness = layers[layersIndex].LayerDim;
				itelayer = layersIndex;
				remainpy = py;
				remainpz = pz;
				packedItemCount = 0;

				for (x = 1; x <= itemsToPackCount; x++)
				{
					itemsToPack[x].IsPacked = false;
				}

				do
				{
					layerinlayer = 0;
					layerDone = false;

					this.PackLayer();

					packedy = packedy + layerThickness;
					remainpy = py - packedy;

					if (layerinlayer != 0 && !quit)
					{
						prepackedy = packedy;
						preremainpy = remainpy;
						remainpy = layerThickness - prelayer;
						packedy = packedy - layerThickness + prelayer;
						remainpz = lilz;
						layerThickness = layerinlayer;
						layerDone = false;

						this.PackLayer();

						packedy = prepackedy;
						remainpy = preremainpy;
						remainpz = pz;
					}

					this.FindLayer(remainpy);
				} while (packing && !quit);

				if ((packedVolume > bestVolume) && !quit)
				{
					bestVolume = packedVolume;
					bestVariant = containerOrientationVariant;
					bestIteration = itelayer;
				}

				if (hundredPercentPacked) break;
			}

			if (hundredPercentPacked) break;

			if ((container.Length == container.Height) && (container.Height == container.Width)) containerOrientationVariant = 6;

			layers = [];
		}
	}

    /**
     * Finds the most proper boxes by looking at all six possible orientations,
	 * empty space given, adjacent boxes, and pallet limits.
     * @param {Number} hmx 
     * @param {Number} hy 
     * @param {Number} hmy 
     * @param {Number} hz 
     * @param {Number} hmz 
     */
	FindBox(hmx, hy, hmy, hz, hmz)
	{
        var y = 0;
        
		bfx = Number.MAX_VALUE;
		bfy = Number.MAX_VALUE;
		bfz = Number.MAX_VALUE;
		bbfx = Number.MAX_VALUE;
		bbfy = Number.MAX_VALUE;
		bbfz = Number.MAX_VALUE;
		boxi = 0;
		bboxi = 0;

		for (y = 1; y <= itemsToPackCount; y = y + itemsToPack[y].Quantity)
		{
			for (x = y; x < x + itemsToPack[y].Quantity - 1; x++)
			{
				if (!itemsToPack[x].IsPacked) break;
			}

			if (itemsToPack[x].IsPacked) continue;

			if (x > itemsToPackCount) return;

			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim2, itemsToPack[x].Dim3);

			if ((itemsToPack[x].Dim1 == itemsToPack[x].Dim3) && (itemsToPack[x].Dim3 == itemsToPack[x].Dim2)) continue;

			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim3, itemsToPack[x].Dim2);
			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim1, itemsToPack[x].Dim3);
			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim3, itemsToPack[x].Dim1);
			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim1, itemsToPack[x].Dim2);
			this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim2, itemsToPack[x].Dim1);
		}
	}

    /**
     * Finds the most proper layer height by looking at the unpacked boxes and the remaining empty space available.
     * @param {Number} thickness 
     */
	FindLayer(thickness)
	{
		var exdim = 0;
		var dimdif = 0;
		var dimen2 = 0;
		var dimen3 = 0;
		var y = 0;
		var z = 0;
		var layereval = 0;
        var maxEvaluations = 1000000;
        
		layerThickness = 0;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			if (itemsToPack[x].IsPacked) continue;

			for (y = 1; y <= 3; y++)
			{
				switch (y)
				{
					case 1:
						exdim = itemsToPack[x].Dim1;
						dimen2 = itemsToPack[x].Dim2;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 2:
						exdim = itemsToPack[x].Dim2;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 3:
						exdim = itemsToPack[x].Dim3;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim2;
						break;
				}

				layereval = 0;

				if ((exdim <= thickness) && (((dimen2 <= px) && (dimen3 <= pz)) || ((dimen3 <= px) && (dimen2 <= pz))))
				{
					for (z = 1; z <= itemsToPackCount; z++)
					{
						if (!(x == z) && !(itemsToPack[z].IsPacked))
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

							if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif)
							{
								dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
							}

							if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif)
							{
								dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
							}

							layereval = layereval + dimdif;
						}
					}

					if (layereval < maxEvaluations)
					{
						maxEvaluations = layereval;
						layerThickness = exdim;
					}
				}
			}
		}

		if (layerThickness == 0 || layerThickness > remainpy) packing = false;
	}

    /**
     * Finds the first to be packed gap in the layer edge.
     */
	FindSmallestZ()
	{
		var scrapmemb = scrapfirst;
		smallestZ = scrapmemb;

		while (scrapmemb.Post)
		{
			if (scrapmemb.Post.CumZ < smallestZ.CumZ)
			{
				smallestZ = scrapmemb.Post;
			}

			scrapmemb = scrapmemb.Post;
		}
	}

    /**
     * Initializes everything.
     * @param {Container} container 
     * @param {Array<Item>} items 
     */
	Initialize(container, items)
	{
		itemsToPack = [];
		itemsPackedInOrder = [];

		// The original code uses 1-based indexing everywhere. This fake entry is added to the beginning
		// of the list to make that possible.
		itemsToPack.push(new Item(0, 0, 0, 0, 0, 0));

		layers = [];
		itemsToPackCount = 0;

		for(var iItems = 0, numItems = items.length; iItems < numItems; iItems++)
		{
            let item = items[iItems];
			for (var i = 1; i <= item.Quantity; i++)
			{
				let newItem = new Item(item.ID, item.Dim1, item.Dim2, item.Dim3, item.Quantity);
				itemsToPack.push(newItem);
			}

			itemsToPackCount += item.Quantity;
		}

		itemsToPack.push(new Item(0, 0, 0, 0, 0));

		totalContainerVolume = container.Length * container.Height * container.Width;
		totalItemVolume = 0;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			totalItemVolume = totalItemVolume + itemsToPack[x].Volume;
		}

		scrapfirst = new ScrapPad();

		scrapfirst.Pre = undefined;
		scrapfirst.Post = undefined;
		packingBest = false;
		hundredPercentPacked = false;
		quit = false;
	}

    /**
     * Lists all possible layer heights by giving a weight value to each of them.
     */
	ListCanditLayers()
	{
		var same = false;
		var exdim = 0;
		var dimdif = 0;
		var dimen2 = 0;
		var dimen3 = 0;
		var y = 0;
		var z = 0;
		var k = 0;
		var layereval = 0;

		layerListLen = 0;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			for (y = 1; y <= 3; y++)
			{
				switch (y)
				{
					case 1:
						exdim = itemsToPack[x].Dim1;
						dimen2 = itemsToPack[x].Dim2;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 2:
						exdim = itemsToPack[x].Dim2;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 3:
						exdim = itemsToPack[x].Dim3;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim2;
						break;
				}

				if ((exdim > py) || (((dimen2 > px) || (dimen3 > pz)) && ((dimen3 > px) || (dimen2 > pz)))) continue;

				same = false;

				for (k = 1; k <= layerListLen; k++)
				{
					if (exdim == layers[k].LayerDim)
					{
						same = true;
						continue;
					}
				}

				if (same) continue;

				layereval = 0;

				for (z = 1; z <= itemsToPackCount; z++)
				{
					if (!(x == z))
					{
						dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

						if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif)
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
						}
						if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif)
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
						}
						layereval = layereval + dimdif;
					}
				}

				layerListLen++;

				layers.push(new Layer());
				layers[layerListLen].LayerEval = layereval;
				layers[layerListLen].LayerDim = exdim;
			}
		}
	}

    /**
     * Transforms the found coordinate system to the one entered by the user and writes them to the report file.
     */
	OutputBoxList()
	{
		var packCoordX = 0;
		var packCoordY = 0;
		var packCoordZ = 0;
		var packDimX = 0;
		var packDimY = 0;
		var packDimZ = 0;

		switch (bestVariant)
		{
			case 1:
				packCoordX = itemsToPack[cboxi].CoordX;
				packCoordY = itemsToPack[cboxi].CoordY;
				packCoordZ = itemsToPack[cboxi].CoordZ;
				packDimX = itemsToPack[cboxi].PackDimX;
				packDimY = itemsToPack[cboxi].PackDimY;
				packDimZ = itemsToPack[cboxi].PackDimZ;
				break;

			case 2:
				packCoordX = itemsToPack[cboxi].CoordZ;
				packCoordY = itemsToPack[cboxi].CoordY;
				packCoordZ = itemsToPack[cboxi].CoordX;
				packDimX = itemsToPack[cboxi].PackDimZ;
				packDimY = itemsToPack[cboxi].PackDimY;
				packDimZ = itemsToPack[cboxi].PackDimX;
				break;

			case 3:
				packCoordX = itemsToPack[cboxi].CoordY;
				packCoordY = itemsToPack[cboxi].CoordZ;
				packCoordZ = itemsToPack[cboxi].CoordX;
				packDimX = itemsToPack[cboxi].PackDimY;
				packDimY = itemsToPack[cboxi].PackDimZ;
				packDimZ = itemsToPack[cboxi].PackDimX;
				break;

			case 4:
				packCoordX = itemsToPack[cboxi].CoordY;
				packCoordY = itemsToPack[cboxi].CoordX;
				packCoordZ = itemsToPack[cboxi].CoordZ;
				packDimX = itemsToPack[cboxi].PackDimY;
				packDimY = itemsToPack[cboxi].PackDimX;
				packDimZ = itemsToPack[cboxi].PackDimZ;
				break;

			case 5:
				packCoordX = itemsToPack[cboxi].CoordX;
				packCoordY = itemsToPack[cboxi].CoordZ;
				packCoordZ = itemsToPack[cboxi].CoordY;
				packDimX = itemsToPack[cboxi].PackDimX;
				packDimY = itemsToPack[cboxi].PackDimZ;
				packDimZ = itemsToPack[cboxi].PackDimY;
				break;

			case 6:
				packCoordX = itemsToPack[cboxi].CoordZ;
				packCoordY = itemsToPack[cboxi].CoordX;
				packCoordZ = itemsToPack[cboxi].CoordY;
				packDimX = itemsToPack[cboxi].PackDimZ;
				packDimY = itemsToPack[cboxi].PackDimX;
				packDimZ = itemsToPack[cboxi].PackDimY;
				break;
		}

		itemsToPack[cboxi].CoordX = packCoordX;
		itemsToPack[cboxi].CoordY = packCoordY;
		itemsToPack[cboxi].CoordZ = packCoordZ;
		itemsToPack[cboxi].PackDimX = packDimX;
		itemsToPack[cboxi].PackDimY = packDimY;
		itemsToPack[cboxi].PackDimZ = packDimZ;

		itemsPackedInOrder.push(itemsToPack[cboxi]);
	}

    /**
     * Packs the boxes found and arranges all variables and records properly.
     */
	PackLayer()
	{
		var lenx = 0;
		var lenz = 0;
		var lpz = 0;

		if (layerThickness == 0)
		{
			packing = false;
			return;
		}

		scrapfirst.CumX = px;
		scrapfirst.CumZ = 0;

        //for (; !quit;)
        while(!quit)
		{
			this.FindSmallestZ();

			if ((!smallestZ.Pre) && (!smallestZ.Post))
			{
				//*** SITUATION-1: NO BOXES ON THE RIGHT AND LEFT SIDES ***

				lenx = smallestZ.CumX;
				lpz = remainpz - smallestZ.CumZ;
				this.FindBox(lenx, layerThickness, remainpy, lpz, lpz);
				this.CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordX = 0;
				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				if (cboxx == smallestZ.CumX)
				{
					smallestZ.CumZ = smallestZ.CumZ + cboxz;
				}
				else
				{
					smallestZ.Post = new ScrapPad();

					smallestZ.Post.Post = undefined;
					smallestZ.Post.Pre = smallestZ;
					smallestZ.Post.CumX = smallestZ.CumX;
					smallestZ.Post.CumZ = smallestZ.CumZ;
					smallestZ.CumX = cboxx;
					smallestZ.CumZ = smallestZ.CumZ + cboxz;
				}
			}
			else if (!smallestZ.Pre)
			{
				//*** SITUATION-2: NO BOXES ON THE LEFT SIDE ***

				lenx = smallestZ.CumX;
				lenz = smallestZ.Post.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				this.CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				if (cboxx == smallestZ.CumX)
				{
					itemsToPack[cboxi].CoordX = 0;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.CumZ = smallestZ.Post.CumZ;
						smallestZ.CumX = smallestZ.Post.CumX;
						trash = smallestZ.Post;
						smallestZ.Post = smallestZ.Post.Post;

						if (smallestZ.Post)
						{
							smallestZ.Post.Pre = smallestZ;
						}
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
					else
					{
						smallestZ.Post.Pre = new ScrapPad();

						smallestZ.Post.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre.Pre = smallestZ;
						smallestZ.Post = smallestZ.Post.Pre;
						smallestZ.Post.CumX = smallestZ.CumX;
						smallestZ.CumX = smallestZ.CumX - cboxx;
						smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}
			else if (!smallestZ.Post)
			{
				//*** SITUATION-3: NO BOXES ON THE RIGHT SIDE ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				this.CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

				if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX)
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.CumX;
						smallestZ.Pre.Post = undefined;
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
					}
					else
					{
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}
			else if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ)
			{
				//*** SITUATION-4: THERE ARE BOXES ON BOTH OF THE SIDES ***

				//*** SUBSITUATION-4A: SIDES ARE EQUAL TO EACH OTHER ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;

				this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				this.CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;

				if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX)
				{
					itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Post.CumX;

						if (smallestZ.Post.Post)
						{
							smallestZ.Pre.Post = smallestZ.Post.Post;
							smallestZ.Post.Post.Pre = smallestZ.Pre;
						}
						else
						{
							smallestZ.Pre.Post = undefined;
						}
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else if (smallestZ.Pre.CumX < px - smallestZ.CumX)
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.CumX = smallestZ.CumX - cboxx;
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
					}
					else
					{
						itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
						itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
					}
					else
					{
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
						smallestZ.Post.Pre = new ScrapPad();

						smallestZ.Post.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre.Pre = smallestZ;
						smallestZ.Post = smallestZ.Post.Pre;
						smallestZ.Post.CumX = smallestZ.CumX;
						smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
				}
			}
			else
			{
				//*** SUBSITUATION-4B: SIDES ARE NOT EQUAL TO EACH OTHER ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				this.CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

				if (cboxx == (smallestZ.CumX - smallestZ.Pre.CumX))
				{
					if ((smallestZ.CumZ + cboxz) == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.CumX;
						smallestZ.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre = smallestZ.Pre;
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if ((smallestZ.CumZ + cboxz) == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
					}
					else if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
					else
					{
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}

			this.VolumeCheck();
		}
	}

    /**
     * Using the parameters found, packs the best solution found and reports to the console.
     * @param {Container} container 
     */
	Report(container)
	{
		quit = false;

		switch (bestVariant)
		{
			case 1:
				px = container.Length; py = container.Height; pz = container.Width;
				break;

			case 2:
				px = container.Width; py = container.Height; pz = container.Length;
				break;

			case 3:
				px = container.Width; py = container.Length; pz = container.Height;
				break;

			case 4:
				px = container.Height; py = container.Length; pz = container.Width;
				break;

			case 5:
				px = container.Length; py = container.Width; pz = container.Height;
				break;

			case 6:
				px = container.Height; py = container.Width; pz = container.Length;
				break;
		}

		packingBest = true;

		//Print("BEST SOLUTION FOUND AT ITERATION                      :", bestIteration, "OF VARIANT", bestVariant);
		//Print("TOTAL ITEMS TO PACK                                   :", itemsToPackCount);
		//Print("TOTAL VOLUME OF ALL ITEMS                             :", totalItemVolume);
		//Print("WHILE CONTAINER ORIENTATION X - Y - Z                 :", px, py, pz);

		layers.length = 0;
		layers[0] = new Layer(-1);
		this.ListCanditLayers();
        //layers = layers.OrderBy(l => l.LayerEval).ToList();
        layers.sort(Layer.SortByEval);
		packedVolume = 0;
		packedy = 0;
		packing = true;
		layerThickness = layers[bestIteration].LayerDim;
		remainpy = py;
		remainpz = pz;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			itemsToPack[x].IsPacked = false;
		}

		do
		{
			layerinlayer = 0;
			layerDone = false;
			this.PackLayer();
			packedy = packedy + layerThickness;
			remainpy = py - packedy;

			if (layerinlayer > epsilon)
			{
				prepackedy = packedy;
				preremainpy = remainpy;
				remainpy = layerThickness - prelayer;
				packedy = packedy - layerThickness + prelayer;
				remainpz = lilz;
				layerThickness = layerinlayer;
				layerDone = false;
				this.PackLayer();
				packedy = prepackedy;
				remainpy = preremainpy;
				remainpz = pz;
			}

			if (!quit)
			{
				this.FindLayer(remainpy);
			}
		} while (packing && !quit);
	}

    /**
     * After packing of each item, the 100% packing condition is checked.
     */
	VolumeCheck()
	{
		itemsToPack[cboxi].IsPacked = true;
		itemsToPack[cboxi].PackDimX = cboxx;
		itemsToPack[cboxi].PackDimY = cboxy;
		itemsToPack[cboxi].PackDimZ = cboxz;
		packedVolume = packedVolume + itemsToPack[cboxi].Volume;
		packedItemCount++;

		if (packingBest)
		{
			this.OutputBoxList();
		}
		else if (packedVolume == totalContainerVolume || packedVolume == totalItemVolume)
		{
			packing = false;
			hundredPercentPacked = true;
		}
	}
}

export default AFit;