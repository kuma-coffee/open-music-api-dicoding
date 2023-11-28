const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/upload/images/albums/{id}/covers",
    handler: (request, h) => handler.postUploadImageHandler(request, h),
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000,
      },
    },
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: (request, h) => handler.getUploadImageById(request, h),
  },
];

module.exports = routes;
