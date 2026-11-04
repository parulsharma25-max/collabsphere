const API_URL =
    "https://collabsphere-backend-mvbt.onrender.com/api";




export const getToken = () => {
    return localStorage.getItem("token");
};



export const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token = getToken();

    const headers = {
        ...(options.headers || {})
    };


    if (!(options.body instanceof FormData)) {

        headers["Content-Type"] =
            "application/json";
    }


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    const data = await response
        .json()
        .catch(() => ({}));


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );
    }


    return data;
};




export const registerUser = (data) =>
    apiRequest(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );



export const loginUser = (data) =>
    apiRequest(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );




export const createProject = (data) =>
    apiRequest(
        "/projects",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );




export const getProjects = () =>
    apiRequest(
        "/projects"
    );




export const getProjectById = (
    projectId
) =>
    apiRequest(
        `/projects/${projectId}`
    );




export const addMember = (
    projectId,
    email
) =>
    apiRequest(
        `/projects/${projectId}/members`,
        {
            method: "POST",
            body: JSON.stringify({
                email
            })
        }
    );



export const makeProjectPublic = (
    projectId
) =>
    apiRequest(
        `/projects/${projectId}/public`,
        {
            method: "POST"
        }
    );


export const getPublicProject = (
    slug
) =>
    apiRequest(
        `/projects/public/${slug}`
    );



export const createNote = (
    data
) =>
    apiRequest(
        "/notes",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );




export const getNotes = (
    projectId
) =>
    apiRequest(
        `/notes/${projectId}`
    );



export const updateNote = (
    noteId,
    data
) =>
    apiRequest(
        `/notes/${noteId}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );




export const deleteNote = (
    noteId
) =>
    apiRequest(
        `/notes/${noteId}`,
        {
            method: "DELETE"
        }
    );



export const explainNote = (
    content
) =>
    apiRequest(
        "/gemini/explain",
        {
            method: "POST",
            body: JSON.stringify({
                content
            })
        }
    );



export const generateDocs = (
    content
) =>
    apiRequest(
        "/gemini/docs",
        {
            method: "POST",
            body: JSON.stringify({
                content
            })
        }
    );




export const generateReadme = (
    content
) =>
    apiRequest(
        "/gemini/readme",
        {
            method: "POST",
            body: JSON.stringify({
                content
            })
        }
    );


export const uploadSingleFile = (
    file,
    projectId
) => {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "projectId",
        projectId
    );

    return apiRequest(
        "/files/upload",
        {
            method: "POST",
            body: formData
        }
    );
};



export const uploadMultipleFiles = (
    files,
    projectId
) => {

    const formData =
        new FormData();

    files.forEach(
        (file) => {
            formData.append(
                "files",
                file
            );
        }
    );

    formData.append(
        "projectId",
        projectId
    );

    return apiRequest(
        "/files/upload-multiple",
        {
            method: "POST",
            body: formData
        }
    );
};



export const getProjectFiles = (
    projectId
) =>
    apiRequest(
        `/files/${projectId}`
    );



export const deleteFile = (
    fileId
) =>
    apiRequest(
        `/files/${fileId}`,
        {
            method: "DELETE"
        }
    );



export const explainFile = (
    content
) =>
    apiRequest(
        "/gemini/explain",
        {
            method: "POST",
            body: JSON.stringify({
                content
            })
        }
    );