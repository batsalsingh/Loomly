class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // Mongoose query (e.g., Product.find())
    this.queryStr = queryStr; // URL query string (e.g., req.query)
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $text: {
            $search: this.queryStr.keyword,
            $caseSensitive: false
          }
        }
      : {};
    
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing fields for other features
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);
    
    // Filter for Price and Rating (example)
    let queryStr = JSON.stringify(queryCopy);
    // Add '$' before gte, lte, gt, lt
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by creation date
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export { ApiFeatures };