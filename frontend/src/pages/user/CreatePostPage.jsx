import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/ui/SectionHeader";
import { postApi } from "../../api/postApi";

function CreatePostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibilityLevel: "INTERNAL",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await postApi.create({ ...formData, submitForApproval: true });
      navigate("/posts");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Secure Publishing" title="Create Encrypted Post" description="Titles and bodies are encrypted before storage, with MAC integrity validation applied." />
      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <input 
          className="input" 
          placeholder="Post title" 
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input 
            className="input" 
            placeholder="Category" 
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <select 
            className="input" 
            value={formData.visibilityLevel}
            onChange={(e) => setFormData({ ...formData, visibilityLevel: e.target.value })}
          >
            <option value="DEPARTMENT">DEPARTMENT</option>
            <option value="INTERNAL">INTERNAL</option>
            <option value="PUBLIC">PUBLIC</option>
          </select>
        </div>
        <textarea 
          className="input min-h-48" 
          placeholder="Encrypted body content draft" 
          required
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="button-primary">
            {loading ? "Saving..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostPage;
