import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductoForm from "../components/ProductoForm";

describe("ProductoForm (React Testing Library)", () => {
  it("muestra un error y no envía si falta el nombre", async () => {
    const onSubmit = vi.fn();
    render(<ProductoForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /agregar producto/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("El nombre es obligatorio");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía los datos convertidos y limpia el formulario", async () => {
    const onSubmit = vi.fn();
    render(<ProductoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Nombre"), "Café");
    await userEvent.type(screen.getByLabelText("Precio"), "12.5");
    await userEvent.click(screen.getByRole("button", { name: /agregar producto/i }));

    expect(onSubmit).toHaveBeenCalledWith({ nombre: "Café", descripcion: "", precio: 12.5, stock: 0 });
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });
});
