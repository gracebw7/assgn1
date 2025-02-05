// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  
  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    const { _id } = userToDelete;
    fetch(`http://localhost:8000/users/${_id}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok){
        const updated = characters.filter((character, i) => i !== index);
        setCharacters(updated);
      }else{
        throw new Error("Failed to delete user");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  function updateList(person) {
    postUser(person)
      .then((response) => response.json())
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  const postUser = async (person) => {
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
      if (response.status === 201) {
        return response;
      } else {
        throw new Error("Resource not found");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
