
import { Heart } from "lucide-react";

function SavedLooks() {
  return (
    <div className="page-container">
      <h1>Saved Looks ❤️</h1>
      <p>Your favourite outfit collections.</p>
      <div className="page-card">
        <Heart size={40} />
        <h2>No saved outfits yet</h2>
        <p>Your favourite looks will appear here.</p>
      </div>
    </div>
  );
}

export default SavedLooks;
