import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    uploadMultipleFiles,
    uploadSingleFile,
    getProjectFiles,
    deleteFile,
    explainFile
} from "../services/api";


const BACKEND_URL =
    "https://collabsphere-backend-mvbt.onrender.com";


function Files() {


    const [searchParams] =
        useSearchParams();

    const projectIdFromUrl =
        searchParams.get("projectId");


    const [projectId, setProjectId] =
        useState(projectIdFromUrl || "");

    const [singleFile, setSingleFile] =
        useState(null);

    const [multipleFiles, setMultipleFiles] =
        useState([]);

    const [files, setFiles] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingFiles, setLoadingFiles] =
        useState(false);

    const [explainingId, setExplainingId] =
        useState(null);

    const [explanation, setExplanation] =
        useState("");



    const loadFiles = async () => {

        if (!projectId) {

            setError(
                "Please enter project ID."
            );

            return;
        }


        try {

            setLoadingFiles(true);

            setError("");
            setMessage("");

            const data =
                await getProjectFiles(
                    projectId
                );

            setFiles(
                data.files || []
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoadingFiles(false);
        }
    };


    useEffect(() => {

        if (projectIdFromUrl) {

            setProjectId(
                projectIdFromUrl
            );

        }

    }, [projectIdFromUrl]);



    useEffect(() => {

        if (!projectIdFromUrl) {
            return;
        }


        const loadProjectFiles =
            async () => {

                try {

                    setLoadingFiles(true);

                    setError("");
                    setMessage("");

                    const data =
                        await getProjectFiles(
                            projectIdFromUrl
                        );

                    setFiles(
                        data.files || []
                    );

                } catch (error) {

                    setError(
                        error.message
                    );

                } finally {

                    setLoadingFiles(false);
                }
            };


        loadProjectFiles();

    }, [projectIdFromUrl]);



    const uploadOne = async () => {

        if (
            !singleFile ||
            !projectId
        ) {

            setError(
                "Please select a file and enter project ID."
            );

            return;
        }


        setLoading(true);

        setMessage("");
        setError("");


        try {

            await uploadSingleFile(
                singleFile,
                projectId
            );


            setMessage(
                "File uploaded successfully."
            );


            setSingleFile(null);


            await loadFiles();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };



    const uploadMany = async () => {

        if (
            !multipleFiles.length ||
            !projectId
        ) {

            setError(
                "Please select files and enter project ID."
            );

            return;
        }


        setLoading(true);

        setMessage("");
        setError("");


        try {

            await uploadMultipleFiles(
                Array.from(multipleFiles),
                projectId
            );


            setMessage(
                "Files uploaded successfully."
            );


            setMultipleFiles([]);


            await loadFiles();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    const removeFile = async (
        fileId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this file?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setMessage("");
            setError("");


            await deleteFile(
                fileId
            );


            setMessage(
                "File deleted successfully."
            );


            await loadFiles();

        } catch (error) {

            setError(
                error.message
            );
        }
    };



    const explainCode = async (
        file
    ) => {

        setExplainingId(
            file._id
        );

        setExplanation("");

        setError("");
        setMessage("");


        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/${file.filePath}`
                );


            if (!response.ok) {

                throw new Error(
                    "Could not read the file."
                );
            }


            const content =
                await response.text();


            const data =
                await explainFile(
                    content
                );


            setExplanation(
                data.explanation ||
                "No explanation received."
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setExplainingId(
                null
            );
        }
    };
    const previewFile = (
        file
    ) => {

        const fileUrl =
            `${BACKEND_URL}/${file.filePath}`;


        window.open(
            fileUrl,
            "_blank"
        );
    };


    const formatFileSize = (
        bytes
    ) => {

        if (!bytes) {
            return "0 KB";
        }


        if (bytes < 1024) {
            return `${bytes} B`;
        }


        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;
        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };


    const isCodeFile = (
        fileName
    ) => {

        const codeExtensions = [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".py",
            ".java",
            ".cpp",
            ".c",
            ".html",
            ".css",
            ".json",
            ".md"
        ];


        return codeExtensions.some(
            (extension) =>
                fileName
                    .toLowerCase()
                    .endsWith(extension)
        );
    };


    return (

        <div className="content-page">



            <div className="section-heading">

                <p className="eyebrow">
                    PROJECT FILES
                </p>

                <h1>
                    File Uploads 📤
                </h1>

                <p>
                    Upload, preview and manage
                    your project files.
                </p>

            </div>



            <div className="panel project-selector">

                <label>
                    Project ID
                </label>


                <div className="project-id-row">

                    <input
                        value={projectId}
                        onChange={(e) =>
                            setProjectId(
                                e.target.value
                            )
                        }
                        placeholder="Enter project ID"
                    />


                    <button
                        type="button"
                        className="primary-btn"
                        onClick={
                            loadFiles
                        }
                        disabled={
                            loadingFiles
                        }
                    >
                        {loadingFiles
                            ? "Loading..."
                            : "Load Files"}
                    </button>

                </div>


                <small>
                    Allowed: JS, JSX, TXT, MD,
                    PDF, PNG, JPG, JPEG.
                    Maximum 5 MB.
                </small>

            </div>



            {message && (

                <div className="success-box">
                    {message}
                </div>

            )}


            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            <div className="two-column">


                {/* SINGLE FILE */}

                <div className="panel upload-card">

                    <div className="upload-icon">
                        📄
                    </div>


                    <h2>
                        Single File
                    </h2>


                    <p>
                        Upload one file to your
                        project.
                    </p>


                    <input
                        type="file"
                        onChange={(e) =>
                            setSingleFile(
                                e.target.files[0]
                            )
                        }
                    />


                    {singleFile && (

                        <p>
                            Selected:{" "}
                            <strong>
                                {
                                    singleFile.name
                                }
                            </strong>
                        </p>

                    )}


                    <button
                        type="button"
                        className="primary-btn"
                        onClick={
                            uploadOne
                        }
                        disabled={
                            loading
                        }
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload File"}
                    </button>

                </div>


                {/* MULTIPLE FILES */}

                <div className="panel upload-card">

                    <div className="upload-icon">
                        📚
                    </div>


                    <h2>
                        Multiple Files
                    </h2>


                    <p>
                        Upload up to 5 files at
                        once.
                    </p>


                    <input
                        type="file"
                        multiple
                        onChange={(e) =>
                            setMultipleFiles(
                                e.target.files
                            )
                        }
                    />


                    {multipleFiles.length >
                        0 && (

                        <p>
                            {
                                multipleFiles.length
                            }{" "}
                            files selected
                        </p>

                    )}


                    <button
                        type="button"
                        className="primary-btn"
                        onClick={
                            uploadMany
                        }
                        disabled={
                            loading
                        }
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload Files"}
                    </button>

                </div>

            </div>


            <div className="panel">

                <div className="section-heading">

                    <p className="eyebrow">
                        PROJECT STORAGE
                    </p>


                    <h2>
                        Uploaded Files
                    </h2>


                    <p>
                        Files uploaded to this
                        project.
                    </p>

                </div>


                {loadingFiles ? (

                    <div className="empty">
                        Loading files...
                    </div>

                ) : files.length === 0 ? (

                    <div className="empty">
                        No files uploaded yet.
                    </div>

                ) : (

                    <div className="note-list">

                        {files.map(
                            (file) => (

                                <div
                                    className="note-card"
                                    key={file._id}
                                >

                                    <h3>
                                        📄{" "}
                                        {
                                            file.fileName
                                        }
                                    </h3>


                                    <p>
                                        Type:{" "}
                                        {
                                            file.fileType
                                        }
                                    </p>


                                    <p>
                                        Size:{" "}
                                        {formatFileSize(
                                            file.fileSize
                                        )}
                                    </p>


                                    <div className="card-actions">


                                        {/* PREVIEW */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                previewFile(
                                                    file
                                                )
                                            }
                                        >
                                            Preview
                                        </button>


                                        {/* GEMINI */}

                                        {isCodeFile(
                                            file.fileName
                                        ) && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    explainCode(
                                                        file
                                                    )
                                                }
                                                disabled={
                                                    explainingId ===
                                                    file._id
                                                }
                                            >
                                                {
                                                    explainingId ===
                                                    file._id
                                                        ? "Explaining..."
                                                        : "Explain with Gemini"
                                                }
                                            </button>

                                        )}


                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFile(
                                                    file._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {explanation && (

                <div className="panel">

                    <h2>
                        🤖 Gemini Explanation
                    </h2>


                    <div className="success-box">

                        <pre
                            style={{
                                whiteSpace:
                                    "pre-wrap",
                                fontFamily:
                                    "inherit"
                            }}
                        >
                            {explanation}
                        </pre>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Files;