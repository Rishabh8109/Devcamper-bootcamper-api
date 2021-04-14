const advanceResult = (model , populate) => async (req,res,next) => {
  let query;
	// copied query
	const reqQuery = { ...req.query };

	const removeField = ["select", "sort", "limit", "page"];

	// removeField
	removeField.forEach((param) => delete reqQuery[param]);

	// converting object to json
	let queryStr = JSON.stringify(reqQuery);

	// adding symbole from of comparasion query ($gt $lt) etc
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	query = model.find(JSON.parse(queryStr)).populate({ path: "courses" });

	// SELECT FEILD
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// SORT FIELDS
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate);
  }

  const bootcamp = await query;

  res.advanceResult = {
    success: true,
    count: bootcamp.length,
    pagination: pagination,
    data: bootcamp,
  }
  next();
}

module.exports  = advanceResult;