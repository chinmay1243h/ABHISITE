import { client } from "./axiosClient";


export function Signup(payLoad:any){
    return client.post('/auth/register',payLoad)
}

export function verifyOTP(payLoad:any){
    return client.post('/auth/verify-user',payLoad);
}
export function resendOTP(payLoad:any){
    return client.post('/auth/resendOtp',payLoad);
}

export function login(payLoad:any){
    return client.post('/auth/login',payLoad);
}

export function insertPortfolioData(payLaod:any){
    return client.post('/portfolio/create',payLaod);
}

export function getProfile(){
    return client.get('/auth/profile');
}


export function docsUpload(payLoad:any) {
    return client.post("/auth/upload-doc", payLoad);
}


export function insertPortfolioProjectData(payLaod:any){
    return client.post('/portfolioProject/create',payLaod);
}


export function insertPortfolioPhotos(payLoad:any){
    return client.post('/portfolioPhoto/create',payLoad);
}

export function insertPortfolioAchivements(payLoad:any){
    return client.post('/portfolioAchivement/create',payLoad);
}

export function insertPortfolioContact(payLoad:any){
    return client.post('/portfolioContact/create',payLoad);
}

 
export function getportfolioData(id:any){
    return client.get(`/portfolio/get-one-record/${id}`);
}

export function getPortfolioDetails(userId: any) {
    return client.get(`/portfolio/search-one-record`, { params: { userId } });
};


export function getPortfolioDetailsBelongsToTable(body: any) {
    return client.post(`/portfolio/get-all-record-with-belongs-to`,body);
};

export function postJob(payLoad:any){
    return client.post('/JobPosting/create',payLoad);
}

export function getAllPostJob(payLoad:any){
    return client.post('/JobPosting/search-record',payLoad)
}

export function getOneJob(id:any){
    return client.get(`/JobPosting/get-one-record/${id}`);
}

export function getAllArtist(payload:any){
    return client.post('/portfolio/search-record',payload);
}


export function getporfileData(id:any){
    return client.get(`/auth/get-one-record/${id}`);
}


export function editProfile(payLoad:any){
    return client.patch('/auth/update-profile',payLoad)
}

export function insertCourse(payLoad:any){
    return client.post('/courses',payLoad);
}

export function getAllCourse(payLoad:any){
    return client.get("/courses",{ params: payLoad });
}

export function getOneCourse(id:any){
    return client.get(`/courses/${id}`);
}

export function createOrder (payload:any) {
    return client.post(`/razorpay/orders`, payload);
  };
  
export function verifyPayment (payload:any) {
    return client.post(`/razorpay/verify`, payload);
};

export function createOrderinDB(payLoad:any){
   return client.post("/Order/create",payLoad)
}
export function createPayment(payLoad:any){
    return client.post("/Payment/create",payLoad)
}

export function createVideo(payLoad:any){
 return client.post("/Video/create",payLoad)
}
export function createAudio(payLoad:any){
    return client.post("/Audio/create",payLoad)
}
export function createPdf(payLoad:any){
    return client.post("/Pdf/create",payLoad)
}

export function getAllPaymentDetailsForUser(payLoad: any) {
    return client.post(`/Payment/search-record`, payLoad);
};


export function getCourseBelongsTo(body: any) {
    return client.post(`/Course/get-all-record-with-belongs-to`,body);
};

export function postComment(payLoad:any){
    return client.post("/Comment/create",payLoad);
}
export function getAllComments(payLoad: any) {
    return client.post(`/Comment/search-record`, payLoad);
};


export function sendJobPosting(payLoad:any){
    return client.post("/job/send-email",payLoad);
}
export function getPortfolioDetails1(id: any) {
    return client.get(`/portfolio/search-one-record`, { params: { id} });
};

export function getportfolioProject(portfolioId:any){
    return client.get(`/portfolioProject/search-one-record`, { params: { portfolioId} });
}

export function getportfolioPhoto(portfolioId:any){
    return client.get(`/portfolioPhoto/search-one-record`, { params: { portfolioId} });
}

export function getportfolioAchivement(payLoad:any){
    return client.post(`/portfolioAchivement/search-record`, payLoad);
}
export function getportfolioContact(portfolioId:any){
    return client.get(`/portfolioContact/search-one-record`, { params: { portfolioId} });
}
export function getProfile1(id: any) {
    return client.get(`/User/search-one-record`, { params: { id} });
};

export function NewsLatter(payLoad:any){
    return client.post("/NewsLatter/create",payLoad);
}

export function createNewsandBlogs(payLoad:any){
    return client.post("/NewsandBlogs/create",payLoad)
}

export function getAllNewsAndBlogs(payLoad:any){
    return client.post("/NewsandBlogs/search-record",payLoad)
}

export function updateNewsAndBlogRecod(payLoad:any,id:any){
    return client.patch(`/NewsandBlogs/update-record/${id}`,payLoad)
}

export function getOneNewsRecord(id:any){
    return client.get(`/NewsandBlogs/get-one-record/${id}`)
}

export function deleteNewsRecord(id:any){
    return client.delete(`/NewsandBlogs/delete-record/${id}`)
}

export function getAllUser(payLoad:any){
    return client.post("/User/search-record",payLoad)
}
export function deleteUser(id:any){
    return client.delete(`/User/delete-record/${id}`)
}


export  function createMovies(payLoad:any){
    return client.post("/Movies/create",payLoad)
}

export function getAllMovies(payLoad:any){
    return client.post("/Movies/search-record",payLoad)
}

export function updateMovies(payLoad:any,id:any){
    return client.patch(`/Movies/update-record/${id}`,payLoad)
}

export function getOneMovies(id:any){
    return client.get(`/Movies/get-one-record/${id}`)
}

export function deleteMovies(id:any){
    return client.delete(`/Movies/delete-record/${id}`)
}

export function createContactUs(payLoad:any){
    return client.post("/Contact/create",payLoad);
}

export function createJobApplications(payLoad:any){
    return client.post("/JobApplication/create",payLoad);
}

export function getAllAppliedJobs(payLoad:any){
    return client.post("/JobApplication/search-record",payLoad)
}

export function getAllAppliedJobsBelongsTo(payLoad:any){
    return client.post("/JobPosting/get-all-record-with-belongs-to",payLoad)
}

export function deleteCourse(id:any){
    return client.delete(`/courses/${id}`)
}

export function publishCourse(id: any) {
    return client.post(`/courses/${id}/publish`);
}
export function deleteJobs(id:any){
    return client.delete(`/JobPosting/delete-record/${id}`)
}
export function updateCourse(payLoad:any,id:any){
    return client.patch(`/courses/${id}`,payLoad)
}

export function updatePortfolio(id: any,payLoad:any) {
    return client.patch(`/portfolio/update-record/${id}`,payLoad);
};

export function getPortfolio(payLoad:any){
    return client.post("/portfolio/search-record",payLoad);
}

export function getPortfolioProjectDetails(payLoad:any){
    return client.post(`/portfolioProject/search-record`, payLoad);
}

export function deletePortfolioProject(id:any){
    return client.delete(`/portfolioProject/delete-record/${id}`)
}
export function editPortfolioProject(id: any,payLoad:any) {
    return client.patch(`/portfolioProject/update-record/${id}`,payLoad);
};

export function editPortfolioAchivememts(id: any,payLoad:any) {
    return client.patch(`/portfolioAchivement/update-record/${id}`,payLoad);
};
export function getPortfolioPhoto(payLoad:any){
    return client.post(`/portfolioPhoto/search-record`, payLoad);
}
export function editPortfolioPhoto(id: any,payLoad:any) {
    return client.patch(`/portfolioPhoto/update-record/${id}`,payLoad);
};

export function deletePortfolioPhoto(id:any){
    return client.delete(`/portfolioPhoto/delete-record/${id}`)
}
export function getPortfolioContact(portfolioId:any){
    return client.get(`/portfolioContact/search-one-record`, { params: { portfolioId } });
}

export function editPortfolioContact(id:any,payLoad:any){
    return client.patch(`/portfolioContact/update-record/${id}`,payLoad);
}

export function askChatbot(payload: { message: string; history?: { role: string; content: string }[] }) {
    return client.post("/chatbot/ask", payload);
}

export function createCourseWithTelegram(payLoad: any) {
    return client.post("/Course/create-with-telegram", payLoad);
}

export function getCourseByAccessCode(accessCode: string) {
    return client.get(`/Course/get-by-access-code/${accessCode}`);
}
