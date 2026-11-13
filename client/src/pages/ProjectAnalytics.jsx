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

    const [memberStats, setMemberStats] =
        useState([]);

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


            const projectInfo =
                projectData.project;

            setProject(projectInfo);


            const notes =
                notesData.notes ||
                notesData ||
                [];


            const files =
                filesData.files ||
                filesData ||
                [];


            setNotesCount(notes.length);

            setFilesCount(files.length);


            /*
             Create contribution statistics
             for every project member
            */

            const members =
                projectInfo?.members || [];


            const stats =
                members.map((member) => {

                    const memberId =
                        typeof member === "object"
                            ? member._id
                            : member;


                    const notesCreated =
                        notes.filter((note) => {

                            const creator =
                                note.createdBy;

                            const creatorId =
                                typeof creator === "object"
                                    ? creator?._id
                                    : creator;

                            return (
                                String(creatorId) ===
                                String(memberId)
                            );

                        }).length;


                    const filesUploaded =
                        files.filter((file) => {

                            const uploader =
                                file.uploadedBy;

                            const uploaderId =
                                typeof uploader === "object"
                                    ? uploader?._id
                                    : uploader;

                            return (
                                String(uploaderId) ===
                                String(memberId)
                            );

                        }).length;


                    return {
                        member,
                        notesCreated,
                        filesUploaded
                    };

                });


            setMemberStats(stats);


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
                    View project activity and
                    member contributions.
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


            {/* Member Contribution */}

            <div className="panel">

                <h2>
                    Member Contributions
                </h2>

                <p>
                    Notes and files contributed
                    by each project member.
                </p>


                {memberStats.length === 0 ? (

                    <p>
                        No members found.
                    </p>

                ) : (

                    <div>

                        {memberStats.map(
                            (item, index) => {

                                const member =
                                    item.member;

                                const name =
                                    typeof member === "object"
                                        ? (
                                            member.name ||
                                            member.username ||
                                            member.email ||
                                            "Member"
                                        )
                                        : "Member";


                                const email =
                                    typeof member === "object"
                                        ? member.email
                                        : "";


                                return (

                                    <div
                                        key={
                                            typeof member === "object"
                                                ? member._id
                                                : member
                                        }
                                        style={{
                                            padding: "15px 0",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >

                                        <h3>
                                            {name}
                                        </h3>

                                        {email && (
                                            <p>
                                                {email}
                                            </p>
                                        )}


                                        <p>
                                            📝 Notes Created:{" "}
                                            <strong>
                                                {
                                                    item.notesCreated
                                                }
                                            </strong>
                                        </p>


                                        <p>
                                            📁 Files Uploaded:{" "}
                                            <strong>
                                                {
                                                    item.filesUploaded
                                                }
                                            </strong>
                                        </p>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

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
                    members,{" "}
                    <strong>
                        {notesCount}
                    </strong>{" "}
                    notes and{" "}
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