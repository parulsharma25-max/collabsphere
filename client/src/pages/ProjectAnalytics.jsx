import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getProjectById,
    getNotes,
    getProjectFiles
} from "../services/api";


function ProjectAnalytics() {

    const { id } = useParams();

    const [project, setProject] =
        useState(null);

    const [notesCount, setNotesCount] =
        useState(0);

    const [filesCount, setFilesCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");



    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                projectData,
                notesData,
                filesData
            ] = await Promise.all([
                getProjectById(id),
                getNotes(id),
                getProjectFiles(id)
            ]);


            setProject(
                projectData.project
            );


            const notes =
                notesData.notes ||
                notesData ||
                [];


            const files =
                filesData.files ||
                filesData ||
                [];


            setNotesCount(
                notes.length
            );

            setFilesCount(
                files.length
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadAnalytics();

    }, [id]);



    if (loading) {

        return (
            <div className="content-page">

                <div className="panel">

                    <p>
                        Loading analytics...
                    </p>

                </div>

            </div>
        );
    }



    if (error) {

        return (
            <div className="content-page">

                <div className="panel">

                    <h2>
                        Unable to load analytics
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    const membersCount =
        project?.members?.length || 0;


    return (
        <div className="content-page">



            <div className="section-heading">

                <p className="eyebrow">
                    ANALYTICS
                </p>

                <h1>
                    Project Analytics
                </h1>

                <p>
                    View basic activity and
                    contribution information
                    for this project.
                </p>

            </div>

            <div className="panel">

                <h2>
                    {project?.name}
                </h2>

                <p>
                    {project?.description}
                </p>

            </div>



            <div className="two-column">


                

                <div className="panel">

                    <div className="project-icon">
                        👥
                    </div>

                    <h2>
                        {membersCount}
                    </h2>

                    <p>
                        Total Members
                    </p>

                </div>


                

                <div className="panel">

                    <div className="project-icon">
                        📝
                    </div>

                    <h2>
                        {notesCount}
                    </h2>

                    <p>
                        Total Notes
                    </p>

                </div>


                

                <div className="panel">

                    <div className="project-icon">
                        📁
                    </div>

                    <h2>
                        {filesCount}
                    </h2>

                    <p>
                        Total Files
                    </p>

                </div>



                <div className="panel">

                    <div className="project-icon">
                        📊
                    </div>

                    <h2>
                        {membersCount +
                            notesCount +
                            filesCount}
                    </h2>

                    <p>
                        Total Project Activity
                    </p>

                </div>

            </div>


         

            <div className="panel">

                <h2>
                    Contribution Summary
                </h2>

                <p>
                    This project currently has{" "}
                    <strong>
                        {membersCount}
                    </strong>{" "}
                    members,
                    {" "}
                    <strong>
                        {notesCount}
                    </strong>{" "}
                    notes and
                    {" "}
                    <strong>
                        {filesCount}
                    </strong>{" "}
                    uploaded files.
                </p>

            </div>

        </div>
    );
}

export default ProjectAnalytics;