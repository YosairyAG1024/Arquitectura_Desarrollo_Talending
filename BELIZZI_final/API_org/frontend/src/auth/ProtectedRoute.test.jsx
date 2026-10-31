import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";

function renderConToken(token) {
  localStorage.clear();
  if (token) localStorage.setItem("token", token);
  return render(
    <MemoryRouter initialEntries={["/privada"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/privada" element={<ProtectedRoute><p>Contenido privado</p></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("redirige al login cuando no hay token", () => {
    renderConToken(null);
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
  });

  it("muestra el contenido cuando hay token", () => {
    renderConToken("abc");
    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });
});
