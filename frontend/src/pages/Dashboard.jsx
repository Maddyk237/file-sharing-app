import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [tab, setTab] = useState("my");
  const [sharedFiles, setSharedFiles] = useState([]);
  const list = tab === "my" ? files : sharedFiles;

  const loadFiles = async () => {
    const res = await api("/files");
    setFiles(res);
  };

  const loadSharedFiles = async () => {
    const res = await api("/files/shared-with-me");
    setSharedFiles(res);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDownload = async (f) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/files/${f._id}/download`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.originalName;
    a.click();
  };

  const handleShare = async (f) => {
    const email = prompt("Share with user email:");
    if (!email) return;
    const res = await api(`/files/${f._id}/share`, "POST", { email });
    alert(res.message);
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>My Files</h2>
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      <div className="upload-box">
        <strong>Upload Files</strong>
        <br />
        <input
          type="file"
          multiple
          onChange={async (e) => {
            const data = new FormData();
            Array.from(e.target.files).forEach((f) => data.append("files", f));
            await api("/files/upload", "POST", data, true);
            loadFiles();
          }}
        />
      </div>
      <div className="tabs">
        <button
          onClick={() => {
            setTab("my");
            loadFiles();
          }}
        >
          My Files
        </button>
        <button
          onClick={() => {
            setTab("shared");
            loadSharedFiles();
          }}
        >
          Shared With Me
        </button>
      </div>

      <div className="table-wrapper">
        <table className="file-list">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((f) => (
              <tr key={f._id}>
                <td>{f.originalName}</td>
                <td>{(f.size / 1024).toFixed(1)} KB</td>
                <td>{new Date(f.uploadDate).toLocaleString()}</td>
                <td className="file-actions">
                  <button
                    className="btn-download"
                    onClick={() => handleDownload(f)}
                  >
                    Download
                  </button>

                  <button className="btn-share" onClick={() => handleShare(f)}>
                    Share
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
