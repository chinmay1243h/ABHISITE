import React, { useEffect, useState } from 'react';
import { deleteCourse, publishCourse } from '../../services/services';
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
            page: '0',
            pageSize: '50',
            status: 'all', // Get all courses including drafts
        };

        console.log('Fetching instructor courses with payload:', payLoad);
        console.log('User ID:', getUserId());

        // Use the instructor-specific endpoint
        fetch(`http://localhost:4000/api/courses/instructor/me?${new URLSearchParams(payLoad)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then((res: any) => {
            console.log('Instructor courses response:', res);
            
            // Handle the different response format
            const courses = res.data?.courses || res.data?.rows || [];
            const currentUserId = getUserId();
            
            console.log('All courses found:', courses.length);
            console.log('Current user ID:', currentUserId);
            
            // Log each course details
            courses.forEach((course: any, index: number) => {
                console.log(`Course ${index}:`, {
                    id: course.id,
                    _id: course._id,
                    title: course.title,
                    instructor: course.instructor,
                    userId: course.userId,
                    matchesInstructor: course.instructor === currentUserId,
                    matchesUserId: course.userId === currentUserId
                });
            });
            
            console.log('User courses:', courses);
            setAllCourses(courses);
        })
        .catch((err: any) => {
            console.error('Error fetching courses:', err);
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
                    setAllCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId && course.id !== courseId));
                })
                .catch((err: any) => {
                    console.error("Error deleting course:", err);
                    toast.error("Failed to delete the course.");
                });
        }
    };

    const handleUpload = (courseId: string) => {
        navigate('/upload-course', { state: courseId });
    };

    const handleTelegramUpload = (courseId: string) => {
        navigate('/telegram-upload', { state: courseId });
    };

    const handlePublish = (courseId: string) => {
        if (window.confirm("Are you sure you want to publish this course?")) {
            publishCourse(courseId)
                .then(() => {
                    toast.success("Course published successfully!");
                    fetchCourses(); // Refresh the course list
                })
                .catch((err: any) => {
                    console.error("Error publishing course:", err);
                    // Show more detailed error message
                    const errorMessage = err.response?.data?.message || 'Failed to publish course.';
                    toast.error(errorMessage);
                });
        }
    };

    return (
        <div style={containerStyle}>
            {allCourses.length > 0 ? (
                allCourses.map((course) => (
                    <div key={course._id || course.id} style={cardStyle}>
                        <img src={course.thumbnail} alt={course.title} style={imageStyle} />
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p><strong>Price:</strong> ₹{course.price}</p>
                        <p><strong>License:</strong> {course.licenseType}</p>
                        <p><strong>Release Date:</strong> {new Date(course.releaseDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {course.isPublished ? '✅ Published' : '📝 Draft'}</p>
                        <button style={editButtonStyle} onClick={() => handleEdit(course._id || course.id)}>Edit</button>
                        <button style={uploadButtonStyle} onClick={() => handleUpload(course._id || course.id)}>Upload Files</button>
                        <button style={telegramButtonStyle} onClick={() => handleTelegramUpload(course._id || course.id)}>Telegram Upload</button>
                        {!course.isPublished && (
                            <button style={publishButtonStyle} onClick={() => handlePublish(course._id || course.id)}>Publish</button>
                        )}
                        <button style={deleteButtonStyle} onClick={() => handleDelete(course._id || course.id)}>Delete</button>
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

const publishButtonStyle: React.CSSProperties = {
    ...editButtonStyle,
    backgroundColor: '#28a745', // Green color for publish button
};

const uploadButtonStyle: React.CSSProperties = {
    ...editButtonStyle,
    backgroundColor: '#17a2b8', // Blue color for upload button
};

const telegramButtonStyle: React.CSSProperties = {
    ...editButtonStyle,
    backgroundColor: '#0088cc', // Telegram blue color
};

