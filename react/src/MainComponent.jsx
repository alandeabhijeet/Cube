
import React from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function MainComponent() {
  const [cubeState, setCubeState] = React.useState({
    U: ["W", "W", "W", "W", "W", "W", "W", "W", "W"], // Up - White
    L: ["O", "O", "O", "O", "O", "O", "O", "O", "O"], // Left - Orange
    F: ["G", "G", "G", "G", "G", "G", "G", "G", "G"], // Front - Green
    R: ["R", "R", "R", "R", "R", "R", "R", "R", "R"], // Right - Red
    B: ["B", "B", "B", "B", "B", "B", "B", "B", "B"], // Back - Blue
    D: ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"], // Down - Yellow
  });

  const [manualInput, setManualInput] = React.useState({
    U: ["", "", "", "", "", "", "", "", ""],
    L: ["", "", "", "", "", "", "", "", ""],
    F: ["", "", "", "", "", "", "", "", ""],
    R: ["", "", "", "", "", "", "", "", ""],
    B: ["", "", "", "", "", "", "", "", ""],
    D: ["", "", "", "", "", "", "", "", ""],
  });

  const [scrambleSequence, setScrambleSequence] = React.useState("");
  const [solutionPath, setSolutionPath] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const colorMap = {
    W: "#FFFFFF",
    R: "#FF0000",
    G: "#00FF00",
    B: "#0000FF",
    O: "#FFA500",
    Y: "#FFFF00",
  };

  // Rotate a face clockwise
  const rotateFaceClockwise = (face) => {
    return [
      face[6],
      face[3],
      face[0],
      face[7],
      face[4],
      face[1],
      face[8],
      face[5],
      face[2],
    ];
  };

  // Rotate a face counter-clockwise
  const rotateFaceCounterClockwise = (face) => {
    return [
      face[2],
      face[5],
      face[8],
      face[1],
      face[4],
      face[7],
      face[0],
      face[3],
      face[6],
    ];
  };

  const applyCubeMove = (move, state) => {
    const newState = JSON.parse(JSON.stringify(state)); // Deep copy

    switch (move) {
      case "R":
        newState.R = rotateFaceClockwise(newState.R);
        // Rotate edge pieces
        const tempR = [newState.U[2], newState.U[5], newState.U[8]];
        newState.U[2] = newState.F[2];
        newState.U[5] = newState.F[5];
        newState.U[8] = newState.F[8];
        newState.F[2] = newState.D[2];
        newState.F[5] = newState.D[5];
        newState.F[8] = newState.D[8];
        newState.D[2] = newState.B[6];
        newState.D[5] = newState.B[3];
        newState.D[8] = newState.B[0];
        newState.B[6] = tempR[0];
        newState.B[3] = tempR[1];
        newState.B[0] = tempR[2];
        break;

      case "R'":
        newState.R = rotateFaceCounterClockwise(newState.R);
        // Rotate edge pieces opposite direction
        const tempRPrime = [newState.U[2], newState.U[5], newState.U[8]];
        newState.U[2] = newState.B[6];
        newState.U[5] = newState.B[3];
        newState.U[8] = newState.B[0];
        newState.B[6] = newState.D[2];
        newState.B[3] = newState.D[5];
        newState.B[0] = newState.D[8];
        newState.D[2] = newState.F[2];
        newState.D[5] = newState.F[5];
        newState.D[8] = newState.F[8];
        newState.F[2] = tempRPrime[0];
        newState.F[5] = tempRPrime[1];
        newState.F[8] = tempRPrime[2];
        break;

      case "L":
        newState.L = rotateFaceClockwise(newState.L);
        const tempL = [newState.U[0], newState.U[3], newState.U[6]];
        newState.U[0] = newState.B[8];
        newState.U[3] = newState.B[5];
        newState.U[6] = newState.B[2];
        newState.B[8] = newState.D[0];
        newState.B[5] = newState.D[3];
        newState.B[2] = newState.D[6];
        newState.D[0] = newState.F[0];
        newState.D[3] = newState.F[3];
        newState.D[6] = newState.F[6];
        newState.F[0] = tempL[0];
        newState.F[3] = tempL[1];
        newState.F[6] = tempL[2];
        break;

      case "L'":
        newState.L = rotateFaceCounterClockwise(newState.L);
        const tempLPrime = [newState.U[0], newState.U[3], newState.U[6]];
        newState.U[0] = newState.F[0];
        newState.U[3] = newState.F[3];
        newState.U[6] = newState.F[6];
        newState.F[0] = newState.D[0];
        newState.F[3] = newState.D[3];
        newState.F[6] = newState.D[6];
        newState.D[0] = newState.B[8];
        newState.D[3] = newState.B[5];
        newState.D[6] = newState.B[2];
        newState.B[8] = tempLPrime[0];
        newState.B[5] = tempLPrime[1];
        newState.B[2] = tempLPrime[2];
        break;

      case "U":
        newState.U = rotateFaceClockwise(newState.U);
        const tempU = [newState.F[0], newState.F[1], newState.F[2]];
        newState.F[0] = newState.R[0];
        newState.F[1] = newState.R[1];
        newState.F[2] = newState.R[2];
        newState.R[0] = newState.B[0];
        newState.R[1] = newState.B[1];
        newState.R[2] = newState.B[2];
        newState.B[0] = newState.L[0];
        newState.B[1] = newState.L[1];
        newState.B[2] = newState.L[2];
        newState.L[0] = tempU[0];
        newState.L[1] = tempU[1];
        newState.L[2] = tempU[2];
        break;

      case "U'":
        newState.U = rotateFaceCounterClockwise(newState.U);
        const tempUPrime = [newState.F[0], newState.F[1], newState.F[2]];
        newState.F[0] = newState.L[0];
        newState.F[1] = newState.L[1];
        newState.F[2] = newState.L[2];
        newState.L[0] = newState.B[0];
        newState.L[1] = newState.B[1];
        newState.L[2] = newState.B[2];
        newState.B[0] = newState.R[0];
        newState.B[1] = newState.R[1];
        newState.B[2] = newState.R[2];
        newState.R[0] = tempUPrime[0];
        newState.R[1] = tempUPrime[1];
        newState.R[2] = tempUPrime[2];
        break;

      case "D":
        newState.D = rotateFaceClockwise(newState.D);
        const tempD = [newState.F[6], newState.F[7], newState.F[8]];
        newState.F[6] = newState.L[6];
        newState.F[7] = newState.L[7];
        newState.F[8] = newState.L[8];
        newState.L[6] = newState.B[6];
        newState.L[7] = newState.B[7];
        newState.L[8] = newState.B[8];
        newState.B[6] = newState.R[6];
        newState.B[7] = newState.R[7];
        newState.B[8] = newState.R[8];
        newState.R[6] = tempD[0];
        newState.R[7] = tempD[1];
        newState.R[8] = tempD[2];
        break;

      case "D'":
        newState.D = rotateFaceCounterClockwise(newState.D);
        const tempDPrime = [newState.F[6], newState.F[7], newState.F[8]];
        newState.F[6] = newState.R[6];
        newState.F[7] = newState.R[7];
        newState.F[8] = newState.R[8];
        newState.R[6] = newState.B[6];
        newState.R[7] = newState.B[7];
        newState.R[8] = newState.B[8];
        newState.B[6] = newState.L[6];
        newState.B[7] = newState.L[7];
        newState.B[8] = newState.L[8];
        newState.L[6] = tempDPrime[0];
        newState.L[7] = tempDPrime[1];
        newState.L[8] = tempDPrime[2];
        break;

      case "F":
        newState.F = rotateFaceClockwise(newState.F);
        const tempF = [newState.U[6], newState.U[7], newState.U[8]];
        newState.U[6] = newState.L[8];
        newState.U[7] = newState.L[5];
        newState.U[8] = newState.L[2];
        newState.L[8] = newState.D[2];
        newState.L[5] = newState.D[1];
        newState.L[2] = newState.D[0];
        newState.D[2] = newState.R[0];
        newState.D[1] = newState.R[3];
        newState.D[0] = newState.R[6];
        newState.R[0] = tempF[0];
        newState.R[3] = tempF[1];
        newState.R[6] = tempF[2];
        break;

      case "F'":
        newState.F = rotateFaceCounterClockwise(newState.F);
        const tempFPrime = [newState.U[6], newState.U[7], newState.U[8]];
        newState.U[6] = newState.R[0];
        newState.U[7] = newState.R[3];
        newState.U[8] = newState.R[6];
        newState.R[0] = newState.D[2];
        newState.R[3] = newState.D[1];
        newState.R[6] = newState.D[0];
        newState.D[2] = newState.L[8];
        newState.D[1] = newState.L[5];
        newState.D[0] = newState.L[2];
        newState.L[8] = tempFPrime[0];
        newState.L[5] = tempFPrime[1];
        newState.L[2] = tempFPrime[2];
        break;

      case "B":
        newState.B = rotateFaceClockwise(newState.B);
        const tempB = [newState.U[0], newState.U[1], newState.U[2]];
        newState.U[0] = newState.R[2];
        newState.U[1] = newState.R[5];
        newState.U[2] = newState.R[8];
        newState.R[2] = newState.D[8];
        newState.R[5] = newState.D[7];
        newState.R[8] = newState.D[6];
        newState.D[8] = newState.L[6];
        newState.D[7] = newState.L[3];
        newState.D[6] = newState.L[0];
        newState.L[6] = tempB[0];
        newState.L[3] = tempB[1];
        newState.L[0] = tempB[2];
        break;

      case "B'":
        newState.B = rotateFaceCounterClockwise(newState.B);
        const tempBPrime = [newState.U[0], newState.U[1], newState.U[2]];
        newState.U[0] = newState.L[6];
        newState.U[1] = newState.L[3];
        newState.U[2] = newState.L[0];
        newState.L[6] = newState.D[8];
        newState.L[3] = newState.D[7];
        newState.L[0] = newState.D[6];
        newState.D[8] = newState.R[2];
        newState.D[7] = newState.R[5];
        newState.D[6] = newState.R[8];
        newState.R[2] = tempBPrime[0];
        newState.R[5] = tempBPrime[1];
        newState.R[8] = tempBPrime[2];
        break;
    }

    return newState;
  };

  const solveByScrambePath = async () => {
    if (!scrambleSequence) {
      setError(
        "Please click rotation controls to build a scramble sequence first"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
       const response = await fetch(`${apiUrl}/api/path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scramble: scrambleSequence }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setSolutionPath(result.solution || "No solution found");
    } catch (err) {
      console.error(err);
      setError("Failed to get solution from scramble path");
    } finally {
      setLoading(false);
    }
  };


  const performMove = (move) => {
    // Add move to scramble sequence
    const newSequence = scrambleSequence ? `${scrambleSequence} ${move}` : move;
    setScrambleSequence(newSequence);

    // Apply actual cube rotation
    const newState = applyCubeMove(move, cubeState);
    setCubeState(newState);
  };

  const handleManualInputChange = (face, index, value) => {
    const upperValue = value.toUpperCase();
    if (
      upperValue === "" ||
      ["W", "R", "G", "B", "O", "Y"].includes(upperValue)
    ) {
      const newManualInput = { ...manualInput };
      newManualInput[face][index] = upperValue;
      setManualInput(newManualInput);
    }
  };

  const renderFace = (face, faceKey) => (
    <div
      className="grid grid-cols-3 gap-1 p-2 border-2 border-gray-400"
      key={faceKey}
    >
      {face.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 border border-gray-300 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: colorMap[color] || "#f0f0f0" }}
        >
          {faceKey}
          {index + 1}
        </div>
      ))}
    </div>
  );

  const renderManualInputFace = (faceKey, faceName) => (
    <div key={faceKey} className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-semibold mb-3 text-center">{faceName} Face</h4>
      <div className="grid grid-cols-3 gap-2">
        {Array(9)
          .fill()
          .map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              placeholder={`${faceKey}${index + 1}`}
              value={manualInput[faceKey][index]}
              onChange={(e) =>
                handleManualInputChange(faceKey, index, e.target.value)
              }
              className="w-12 h-12 text-center border border-gray-300 rounded text-sm font-bold uppercase"
              style={{
                backgroundColor: manualInput[faceKey][index]
                  ? colorMap[manualInput[faceKey][index]] || "#f0f0f0"
                  : "white",
              }}
            />
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          3x3 Rubik's Cube Solver
        </h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Cube Visualization */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            {/* Up Face */}
            <div className="mb-2">{renderFace(cubeState.U, "U")}</div>

            {/* Middle Row: Left, Front, Right, Back */}
            <div className="flex mb-2">
              {renderFace(cubeState.L, "L")}
              {renderFace(cubeState.F, "F")}
              {renderFace(cubeState.R, "R")}
              {renderFace(cubeState.B, "B")}
            </div>

            {/* Down Face */}
            <div>{renderFace(cubeState.D, "D")}</div>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-4">Cube Rotation Controls</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              "R",
              "R'",
              "L",
              "L'",
              "U",
              "U'",
              "D",
              "D'",
              "F",
              "F'",
              "B",
              "B'",
            ].map((move) => (
              <button
                key={move}
                onClick={() => performMove(move)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded font-mono transition-colors"
              >
                {move}
              </button>
            ))}
          </div>
        </div>

        {/* Scramble Display - Always show */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-2">Scramble Sequence:</h3>
          <p className="text-gray-700 font-mono break-all min-h-[1.5rem]">
            {scrambleSequence ||
              "Click rotation controls above to build sequence..."}
          </p>
          {scrambleSequence && (
            <button
              onClick={solveByScrambePath}
              disabled={loading}
              className="mt-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              {loading ? "Solving..." : "Solve from Scramble Path"}
            </button>
          )}
        </div>




        {/* Solution Display */}
        {solutionPath && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="font-semibold mb-2">Solution:</h3>
            <p className="text-gray-700 font-mono break-all">{solutionPath}</p>
          </div>
        )}

        {/* Reference Information */}
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="font-semibold mb-2">Cube Notation Reference:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-mono">R</span> = Right face clockwise
            </p>
            <p>
              <span className="font-mono">R'</span> = Right face
              counter-clockwise
            </p>
            <p>
              Faces: <span className="font-mono">R</span> (Right),{" "}
              <span className="font-mono">L</span> (Left),{" "}
              <span className="font-mono">U</span> (Up),{" "}
              <span className="font-mono">D</span> (Down),{" "}
              <span className="font-mono">F</span> (Front),{" "}
              <span className="font-mono">B</span> (Back)
            </p>
            <p>
              Colors: <span className="font-mono">W</span> (White),{" "}
              <span className="font-mono">R</span> (Red),{" "}
              <span className="font-mono">G</span> (Green),{" "}
              <span className="font-mono">B</span> (Blue),{" "}
              <span className="font-mono">O</span> (Orange),{" "}
              <span className="font-mono">Y</span> (Yellow)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;