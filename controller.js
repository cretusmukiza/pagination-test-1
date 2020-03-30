const httpStatus = require("http-status"),
  { Error } = require("./util/api_response"),
  { callItemsApi } = require("./util/methods");

exports.controller = async (req, res, next) => {
  try {
    let { page, pageSize } = req.params;
    page = Number(page);
    pageSize = Number(pageSize);
    const numberOfItems = 1000000;
    /**
     * Validating the parameters
     */
    if (
      page <= 0 ||
      pageSize <= 0 ||
      !Number.isInteger(pageSize) ||
      !Number.isInteger(page)
    ) {
      throw new Error({
        message: "Invalid parameters",
        status: httpStatus.BAD_REQUEST
      });
    } else if (page * pageSize > numberOfItems) {
      /**
       * The page before the current page
       */
      let lastPage = page - 1;
      if (numberOfItems - lastPage * pageSize <= pageSize) {
        let startAbsoluteIndex = lastPage * pageSize;
        let searchedPage = numberOfItems / 100;
        const response = await callItemsApi(searchedPage);
        let data = response.data;
        if (!Array.isArray(data)) {
          throw new Error({
            message: "Invalid response",
            status: httpStatus.INTERNAL_SERVER_ERROR
          });
        }
        filteredData = data.filter(
          item => item.absoluteIndex >= startAbsoluteIndex
        );
        res.status(httpStatus.OK).json({
          data: filteredData
        });
      } else {
        /**
         * The index of the first item in the page
         */
        let startAbsoluteIndex = lastPage * pageSize;

        /**
         * The index of the last item in the page
         */
        let endAbsoluteIndex = numberOfItems - 1;

        /**
         * Finding the start page in legacy api
         */

        let startPage = Math.floor(startAbsoluteIndex / 100) + 1;

        /**
         * Finding end page in legacy api
         */
        let endPage = Math.floor(endAbsoluteIndex / 100) + 1;

        let pagesCovered = [];
        let pagesRequests = [];
        for (let page = startPage; page <= endPage; page++) {
          pagesCovered.push(page);
        }

        pagesCovered.forEach(page => {
          pagesRequests.push(callItemsApi(page));
        });
        const response = await Promise.all(pagesRequests);
        if (!Array.isArray(response)) {
          throw new Error({
            message: "Invalid response",
            status: httpStatus.INTERNAL_SERVER_ERROR
          });
        }
        let finalResult = [];
        let firstItem = {};
        response.forEach(item => {
          if (item.page !== startPage) {
            finalResult.concat(item.data);
          }
          if (item.page === startPage) {
            firstItem = item;
          }
        });
        let filteredFirstItem = firstItem.data.filter(
          item => item.absoluteIndex >= startAbsoluteIndex
        );
        finalResult = filteredFirstItem.concat(finalResult);
        res.status(httpStatus.OK).json({ data: finalResult });
      }
    } else {
      /**
       * The index of the first item in the page
       */
      let startAbsoluteIndex = (page - 1) * pageSize;

      /**
       * The index of the last item in the page
       */
      let endAbsoluteIndex = page * pageSize - 1;

      /**
       * Finding the start page in legacy api
       */

      let startPage = Math.floor(startAbsoluteIndex / 100) + 1;

      /**
       * Finding end page in legacy api
       */
      let endPage = Math.floor(endAbsoluteIndex / 100) + 1;

      /**
       * If end page and last page are the same return the items on the page and filter
       * From the start to the end absolute index inclusively
       */
      if (startPage === endPage) {
        const response = await callItemsApi(startPage);
        let data = response.data;
        if (!Array.isArray(data)) {
          throw new Error({
            message: "Invalid response",
            status: httpStatus.INTERNAL_SERVER_ERROR
          });
        }
        filteredData = data.filter(
          item =>
            item.absoluteIndex >= startAbsoluteIndex &&
            item.absoluteIndex <= endAbsoluteIndex
        );
        res.status(httpStatus.OK).json({
          data: filteredData
        });
      } else {

      /**
       * If the last page and start page are different form the request to legacy api for each page
       * between the start page and the last page inclusively
       * Filter the items of the start page greater than  or equal to absolute start index
       * Filter the items of the end page less tjan or equal to the absolute end index
       */
        let pagesCovered = [];
        let pagesRequests = [];
        for (let page = startPage; page <= endPage; page++) {
          pagesCovered.push(page);
        }

        pagesCovered.forEach(page => {
          pagesRequests.push(callItemsApi(page));
        });
        const response = await Promise.all(pagesRequests);
        if (!Array.isArray(response)) {
          throw new Error({
            message: "Invalid response",
            status: httpStatus.INTERNAL_SERVER_ERROR
          });
        }
        let finalResult = [];
        let firstItem = {};
        let lastItem = {};

        response.forEach(item => {
          if (item.page !== startPage && item.page !== endPage) {
            finalResult.concat(item.data);
          }
          if (item.page === startPage) {
            firstItem = item;
          }
          if (item.page === endPage) {
            lastItem = item;
          }
        });
        let filteredFirstItem = firstItem.data.filter(
          item => item.absoluteIndex >= startAbsoluteIndex
        );
        finalResult = filteredFirstItem.concat(finalResult);

        let filteredLastItem = lastItem.data.filter(
          item => item.absoluteIndex <= endAbsoluteIndex
        );
        finalResult = finalResult.concat(filteredLastItem);
        res.status(httpStatus.OK).json({ data: finalResult });
      }
    }
  } catch (error) {
    return next(error);
  }
};
