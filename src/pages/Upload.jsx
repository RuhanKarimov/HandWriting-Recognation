import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToastAlert from '../components/ToastAlert'; // yol doğruysa

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [apiResponseList, setApiResponseList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setApiResponseList(null);
            setError(null);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setToastMessage("Lütfen bir dosya seçin!");
            setShowToast(true);
            return;
        }

        setLoading(true);
        setApiResponseList(null);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newResult = {
                fileName: selectedFile.name,
                result: response.data,
                timestamp: new Date().toISOString(),
            };

            const prevResults = JSON.parse(localStorage.getItem("results")) || [];
            const updatedResults = [newResult, ...prevResults];
            localStorage.setItem("results", JSON.stringify(updatedResults));

            setApiResponseList(response.data);
        } catch (err) {
            setError(`Yükleme hatası: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <h3 className="text-center mb-4">Yazı Analizi</h3>
                <div className="mb-3">
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </div>
                {selectedFile && (
                    <div className="mb-2 text-muted">
                        <small>Seçilen Dosya: {selectedFile.name}</small>
                    </div>
                )}
                <div className="d-grid">
                    <button
                        onClick={handleUpload}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Gönderiliyor...
                            </span>
                        ) : (
                            'Fotoğrafı Gönder'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}

                {apiResponseList && apiResponseList.length > 0 && (
                    <div className="mt-4">
                        <h5 className="mb-3">Model Tahminleri</h5>
                        <ul className="list-group">
                            {apiResponseList.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>Yazar:</strong> {item.predicted_author} <br />
                                    <strong>İçerik:</strong> {item.predicted_text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {apiResponseList && apiResponseList.length === 0 && (
                    <div className="alert alert-warning mt-3">
                        API'den boş bir liste döndü.
                    </div>
                )}
            </div>

            {/* ✅ Toast burada görünür olacak */}
            <ToastAlert
                show={showToast}
                setShow={setShowToast}
                message={toastMessage}
                variant="danger"
            />
        </div>
    );
}

export default Upload;
