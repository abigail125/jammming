import React from "react";
import useUserId from "../hooks/useUserId";
import { findAccessToken } from "../util/getToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//www.npmjs.com/package/react-toastify   this is the link for the toast docs

function SaveToSpotifyButton({ tracks, playlistname }) {
  const { json } = useUserId();

  async function handleClick() {
    if (!playlistname) {
      toast("Add a playlist name to save it");
      return;
    }
    const userId = json.id;
    const accessToken = findAccessToken();
    const res = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistname,
          description: "New playlist description",
          public: false,
        }),
      }
    );

    const json2 = await res.json();

    const uris = tracks.map((item) => item.uri.replace(/["]+/g, ""));

    const res2 = await fetch(
      `https://api.spotify.com/v1/playlists/${json2.id}/tracks?uris=${uris}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range_start: 1,
          insert_before: 3,
          range_length: 2,
        }),
      }
    );
    console.log(res2)
  }

  return (
    <button
      type="button"
      className="saveButton btn btn-outline-success my-2 my-sm-0"
      onClick={handleClick}
    >
      Save {playlistname} To Spotify
    </button>
  );
}

export default SaveToSpotifyButton;
