
import { useState, useEffect } from "react";
import {
  Plus, Trash2, Search, X, Shirt,
  Camera, Image as ImageIcon
} from "lucide-react";

const API_URL = "https://justgo-backend-4q8q.onrender.com/api/wardrobe";

function Wardrobe() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "Tops",
    color: "Black",
    image: ""
  });

  const categories = [
    "All", "Tops", "Bottoms",
    "Dresses", "Shoes", "Accessories"
  ];

 
  // LOAD CLOTHES WHEN PAGE OPENS
  useEffect(() => {
    let isActive = true;

    const loadClothes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load clothes");
        }

        if (isActive) {
          setItems(data.clothes || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);

        if (isActive) {
          console.error("Unable to load wardrobe.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadClothes();

    return () => {
      isActive = false;
    };
  }, []);


  // IMAGE UPLOAD
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ADD CLOTHING TO MONGODB
  const addItem = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter clothing name.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add clothing");
      }

      setItems(prev => [data.clothing, ...prev]);

      setFormData({
        name: "",
        category: "Tops",
        color: "Black",
        image: ""
      });

      setShowForm(false);

      alert("Clothing added successfully!");

    } catch (error) {
      console.error("Add error:", error);
      alert(error.message || "Unable to add clothing.");
    }
  };

  // DELETE CLOTHING FROM MONGODB
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clothing?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete clothing");
      }

      setItems(prev =>
        prev.filter(item => item._id !== id)
      );

      alert("Clothing deleted successfully!");

    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Unable to delete clothing.");
    }
  };

  // SEARCH AND FILTER
  const filteredItems = items.filter(item =>
    (filter === "All" || item.category === filter) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="wardrobe-page">

      <div className="wardrobe-header">
        <div>
          <span className="gold-label">YOUR COLLECTION</span>
          <h1>My Wardrobe</h1>
          <p>Manage your clothes and create your personal style.</p>
        </div>

        <button
          className="add-clothes-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Clothing
        </button>
      </div>

      <div className="wardrobe-stats">
        <div className="stat-card">
          <span>Total Clothing</span>
          <h2>{items.length}</h2>
        </div>

        <div className="stat-card">
          <span>Categories</span>
          <h2>
            {new Set(items.map(i => i.category)).size}
          </h2>
        </div>
      </div>

      <div className="wardrobe-search">
        <Search size={18} />
        <input
          placeholder="Search your wardrobe..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={filter === category ? "active" : ""}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="wardrobe-empty">
          <p>Loading your wardrobe...</p>
        </div>
      ) : (
        <>
          <div className="clothing-grid">
            {filteredItems.map(item => (
              <div className="clothing-card" key={item._id}>
                <div className="clothing-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <Shirt size={55} />
                  )}
                </div>

                <div className="clothing-info">
                  <h3>{item.name}</h3>
                  <p>{item.category} · {item.color}</p>

                  <button
                    className="delete-clothing"
                    onClick={() => deleteItem(item._id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="wardrobe-empty">
              <Shirt size={45} />
              <h3>No clothing found</h3>
              <p>Add your first clothing item to your wardrobe.</p>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="wardrobe-form-overlay">
          <form className="wardrobe-form" onSubmit={addItem}>

            <div className="form-heading">
              <h2>Add New Clothing</h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <label>Clothing Photo</label>

            <div className="image-upload-box">
              {formData.image ? (
                <div className="image-preview">
                  <img
                    src={formData.image}
                    alt="Clothing preview"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        image: ""
                      }))
                    }
                  >
                    <X size={16} /> Remove photo
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon size={40} />
                  <p>Upload your clothing photo</p>

                  <div className="upload-actions">
                    <label className="upload-btn">
                      <ImageIcon size={16} /> Gallery

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        hidden
                      />
                    </label>

                    <label className="upload-btn">
                      <Camera size={16} /> Camera

                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImage}
                        hidden
                      />
                    </label>
                  </div>

                  <small>Maximum image size: 5 MB</small>
                </>
              )}
            </div>

            <label>Clothing Name</label>

            <input
              required
              placeholder="Example: White Cotton Shirt"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))
              }
            />

            <label>Category</label>

            <select
              value={formData.category}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  category: e.target.value
                }))
              }
            >
              {categories.slice(1).map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label>Color</label>

            <input
              placeholder="Example: White"
              value={formData.color}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  color: e.target.value
                }))
              }
            />

            <button
              type="submit"
              className="add-clothes-btn"
            >
              Add to Wardrobe
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

export default Wardrobe;
