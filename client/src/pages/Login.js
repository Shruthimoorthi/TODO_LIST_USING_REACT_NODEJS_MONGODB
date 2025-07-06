import React from "react";
const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://todo-list-using-react-nodejs-mongodb.onrender.com/auth/google"; // use production URL
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage:
          "url('https://images.pexels.com/photos/2249964/pexels-photo-2249964.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        fontFamily: "'Quicksand', sans-serif",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: "5%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top-left brand name */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          fontSize: "2.5rem",
          fontWeight: "bold",
          fontFamily: "Patua One",
          color: "black",
          fontStyle: "italic",
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
         I am your DoBuddy📝
      </div>

      {/* Left-side floating box with transparent background */}
      <div
        style={{
          maxWidth: "500px",
          marginTop: "5rem",
          backgroundColor: "rgba(0, 0, 0, 0.4)", 
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            fontSize: "1.4rem",
            fontFamily: "Patua One",
            color: "white",
            fontWeight: "500",
            lineHeight: "1.6",
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
            marginBottom: "2rem",
          }}
        >
           Every great idea starts with a note. <br />
  DoBuddy helps you capture thoughts, organize tasks, and turn plans into action - all in one place. <br />
  Write freely, Stay focused, Make every day productive.

        </p>
        <button
          onClick={handleLogin}
          style={{
            padding: "12px 30px",
            fontSize: "1.1rem",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "",
            fontStyle:"italic",
            color: "black",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Patua One",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          🔐 Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
