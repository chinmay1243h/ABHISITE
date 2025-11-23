import React, { useEffect, useState } from 'react';
import { getAllCourse, deleteCourse } from '../../services/services';
import { getUserId } from '../../services/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ArtistMyCourse = () => {
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        const payLoad = {
            data: { filter: '', userId: getUserId() },
            page: 0,
            pageSize: 50,
            order: [['createdAt', 'ASC']],
        };

        getAllCourse(payLoad)
            .then((res: any) => {
                setAllCourses(res?.data?.data?.rows || []);
            })
            .catch((err: any) => {
                console.error(err);
            });
    };

    const handleEdit = (courseId: string) => {
        navigate(`/edit-course/${courseId}`);
    };

    const handleDelete = (courseId: string) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            deleteCourse(courseId)
                .then(() => {
                    toast.success("Course deleted successfully!");
                    setAllCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
                })
                .catch((err: any) => {
                    console.error("Error deleting course:", err);
                    toast.error("Failed to delete the course.");
                });
        }
    };

    return (
        <div style={containerStyle}>
            {allCourses.length > 0 ? (
                allCourses.map((course) => (
                    <div key={course.id} style={cardStyle}>
                        <img src={course.thumbnail} alt={course.title} style={imageStyle} />
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p><strong>Price:</strong> ₹{course.price}</p>
                        <p><strong>License:</strong> {course.licenseType}</p>
                        <p><strong>Release Date:</strong> {new Date(course.releaseDate).toLocaleDateString()}</p>
                        <button style={editButtonStyle} onClick={() => handleEdit(course.id)}>Edit</button>
                        <button style={deleteButtonStyle} onClick={() => handleDelete(course.id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No courses found</p>
            )}
        </div>
    );
};

export default ArtistMyCourse;

// Inline styles
const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
};

const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
};

const editButtonStyle: React.CSSProperties = {
    marginTop: '10px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '5px',
};

const deleteButtonStyle: React.CSSProperties = {
    ...editButtonStyle,
    backgroundColor: '#dc3545', // Red color for delete button
};

