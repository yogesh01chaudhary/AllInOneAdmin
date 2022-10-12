const { ServicePrice } = require("../models/servicePrice");

exports.getVendorsService = async (req, res) => {
  try {
    const { body } = req;
    const limit = req.query.limit || 6;
    const skip = req.query.skip || 0;
    console.log(body.serviceId);
    let vendorsService = await ServicePrice.find(
      { service: body.serviceId },
      { __v: 0 }
      // { sort: { "vendor.firstName": 1 } }
    )
      .populate([
        {
          path: "vendor",
          model: "vendor",
          select: { __v: 0 },
        },
        { path: "service", model: "service", select: { __v: 0 } },
      ])
      .sort({ "vendor.firstName": 1 })
      .skip(skip)
      .limit(limit);

    if (!vendorsService) {
      return res
        .status(400)
        .send({ success: false, message: "Something went wrong" });
    }
    if (vendorsService.length == 0) {
      return res.status(200).send({ success: true, message: "No Data Found" });
    }
    return res.status(200).send({
      success: true,
      message: "All Vendors With Matched Service Fetched",
      data: vendorsService,
    });
  } catch (e) {
    return res.send({
      success: false,
      message: "Something went wrong",
      error: e.name,
    });
  }
};
