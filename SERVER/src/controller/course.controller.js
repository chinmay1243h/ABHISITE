const queryService = require("../service/query.service");
const httpres = require("../utils/http");
const { prepareResponse } = require("../utils/response");
const { generateCourseCode, generateUniqueAccessCode } = require("../utils/courseCodeGenerator");

exports.createCourseWithTelegram = async (req, res) => {
  try {
    const { courseId, title, description, price, category, telegramFileId, fileType } = req.body;
    
    // Get user info from token
    const decoded = req.decoded;
    
    // Generate unique codes
    const courseCode = generateCourseCode();
    const accessCode = generateUniqueAccessCode(title);
    
    // Validate required fields and provide defaults
    if (!title) {
      return res
        .status(httpres.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Course title is required", null, null));
    }
    
    if (!description) {
      return res
        .status(httpres.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Course description is required", null, null));
    }
    
    if (!category) {
      return res
        .status(httpres.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Course category is required", null, null));
    }
    
    const coursePayload = {
      userId: decoded?.id || req.body.userId,
      instructor: decoded?.id || req.body.userId, // Add instructor field
      firstName: decoded?.name?.split(' ')[0] || "Unknown",
      lastName: decoded?.name?.split(' ')[1] || "Artist",
      profileImage: null,
      title,
      description,
      courseType: fileType || "video",
      category,
      tags: "",
      price: parseFloat(price) || 0,
      discount: "0%",
      licenseType: "Paid",
      thumbnail: null, // Will be set to telegramFileId for now
      telegramFileId,
      courseCode,
      accessCode,
      releaseDate: new Date(),
      expirationDate: null,
    };

    let result;
    if (fileType === "video") {
      result = await queryService.addData("Video", {
        courseId,
        videoUrl: telegramFileId,
        courseCode,
        accessCode,
        telegramFileId
      });
    } else if (fileType === "audio") {
      result = await queryService.addData("Audio", {
        courseId,
        audioUrl: telegramFileId,
        courseCode,
        accessCode,
        telegramFileId
      });
    } else if (fileType === "pdf") {
      result = await queryService.addData("Pdf", {
        courseId,
        pdfUrl: telegramFileId,
        courseCode,
        accessCode,
        telegramFileId
      });
    }

    // Also create main course record
    const courseRecord = await queryService.addData("Course", coursePayload);

    res
      .status(httpres.CREATED)
      .json(prepareResponse("CREATED", "Course created successfully with Telegram integration", {
        course: courseRecord,
        media: result,
        courseCode,
        accessCode
      }, null));
  } catch (error) {
    console.error("Error creating course with Telegram:", error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("ERROR", "Failed to create course", null, error.message));
  }
};

exports.getCourseByAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.params;
    
    // Find course by access code
    const course = await queryService.getOneDataByCond("Course", { accessCode });
    
    if (!course) {
      return res
        .status(httpres.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", "Course not found with this access code", null, null));
    }

    res
      .status(httpres.OK)
      .json(prepareResponse("OK", "Course found successfully", course, null));
  } catch (error) {
    console.error("Error getting course by access code:", error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("ERROR", "Failed to retrieve course", null, error.message));
  }
};
