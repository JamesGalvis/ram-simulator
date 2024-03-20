"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface MemoryCell {
  value: number | null;
  address: number;
}

export function RAMSimulator() {
  const [memorySize, setMemorySize] = useState<number>(8);
  const [memory, setMemory] = useState<MemoryCell[]>(
    Array.from({ length: memorySize }, (_, i) => ({ value: null, address: i }))
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [inputAddress, setInputAddress] = useState<string>("");

  const [randomAddress, setRandomAddress] = useState<number | null>(null);
  const isFull = memory.every((cell) => cell.value !== null);

  useEffect(() => {
    if (isFull) {
      toast.warning(
        "¡La memoria está completamente llena! Libere espacio antes de continuar."
      );
    } else {
      let randomAddress;
      do {
        randomAddress = Math.floor(Math.random() * memorySize);
      } while (memory[randomAddress].value !== null);
      setRandomAddress(randomAddress);
    }
  }, [memory, isFull, memorySize]);

  // const [isFull, setIsFull] = useState<boolean>(false);

  // // Función para verificar si la memoria está llena
  // useEffect(() => {
  //   setIsFull(memory.every((cell) => cell.value !== null));
  // }, [memory]);

  // // Efecto para mostrar el mensaje de alerta cuando la memoria esté llena
  // useEffect(() => {
  //   if (isFull) {
  //     toast.warning(
  //       "La memoria está completamente llena. Libere espacio antes de continuar."
  //     );
  //   }
  // }, [isFull]);

  const handleReset = () => {
    setMemory(
      Array.from({ length: memorySize }, (_, i) => ({
        value: null,
        address: i,
      }))
    );
    setInputValue("");
    setInputAddress("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(e.target.value);
  };

  const handleWrite = () => {
    const value = parseInt(inputValue, 10);

    if (!isNaN(value) && randomAddress !== null) {
      const newMemory = [...memory];
      newMemory[randomAddress].value = value;
      setMemory(newMemory);
      setInputValue("");
      setRandomAddress(null);
    }
  };

  // const handleWrite = () => {
  //   const address = parseInt(inputAddress, 16);
  //   const value = parseInt(inputValue, 10);

  //   if (
  //     !isNaN(address) &&
  //     !isNaN(value) &&
  //     address >= 0 &&
  //     address < memorySize
  //   ) {
  //     const newMemory = [...memory];
  //     newMemory[address].value = value;
  //     setMemory(newMemory);

  //     setInputValue("");
  //     setInputAddress("");
  //   } else {
  //     toast.error("Dirección o valor inválido.");
  //   }
  // };

  const handleRead = () => {
    const address = parseInt(inputAddress, 10);

    if (!isNaN(address) && address >= 0 && address < memorySize) {
      const value = memory[address].value;
      if (value !== null) {
        toast.success(`Valor en la dirección de memoria ${address}: ${value}`);
      } else {
        toast.success(
          `No hay ningún valor almacenado en la dirección de memoria ${address}`
        );
      }
    } else {
      toast.error("Dirección inválida.");
    }
  };

  return (
    <div className="w-full px-4 py-12 md:py-24 lg:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Simulador de Memoria RAM</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Introduce valores en direcciones de memoria y realice operaciones de
          lectura, escritura y liberacion de memoria.
        </p>
        <div className="grid w-full gap-4">
          {/* <div className="sm:hidden flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="memory-address">
              Dirección de memoria
            </label>
            <Input
              id="memory-address"
              placeholder="Digita la dirección de memoria"
              value={inputAddress}
              onChange={handleAddressChange}
            />
          </div> */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="memory-value">
              Valor
            </label>
            <Input
              id="memory-value"
              disabled={isFull}
              type="number"
              placeholder="Valor que deseas asignarle"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <Button
            disabled={isFull}
            className="bg-emerald-200/70 text-emerald-900 hover:bg-emerald-200/90"
            onClick={handleWrite}
          >
            Asignar
          </Button>
          {/* <Button onClick={handleRead}>Obtener valor</Button> */}
          <Button
            className="bg-indigo-200 text-indigo-800 hover:bg-indigo-200/80"
            onClick={handleReset}
          >
            Liberar memoria
          </Button>
        </div>
        <div>
          {isFull && (
            <div className="flex max-sm:flex-col items-center justify-center p-6 rounded-lg border-red-800 text-red-800 bg-red-200 mb-6">
              <TriangleAlert className="h-5 w-5 mr-4" />
              <p className="max-sm:text-center">
                ¡La memoria está completamente llena! Libere espacio antes de
                continuar.
              </p>
            </div>
          )}
          <div
            className={`border ${
              isFull ? "border-rose-500" : "border-emerald-300"
            } rounded-lg`}
          >
            <table className="rounded-lg min-w-full text-sm text-emerald-800 leading-normal bg-emerald-100">
              <thead>
                <tr
                  className={cn(
                    "bg-emerald-200 rounded-tl-lg rounded-tr-lg",
                    isFull && "bg-rose-300"
                  )}
                >
                  <th className="px-4 py-3 text-sm font-bold text-left rounded-tl-lg">
                    Dirección
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-left rounded-tr-lg">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {memory.map((cell, i) => (
                  <tr
                    key={cell.address}
                    className={cn(
                      "border-t border-emerald-300 rounded-bl-lg rounded-b-lg",
                      cell.value !== null && "bg-rose-100",
                      isFull && "border-rose-300"
                    )}
                  >
                    <td
                      className={cn(
                        "px-4 py-3 text-sm font-medium text-left",
                        i === memory.length - 1 && "rounded-bl-lg"
                      )}
                    >
                      {`0x${cell.address.toString(16).padStart(4, "0")}`}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-sm text-left",
                        i === memory.length - 1 && "rounded-br-lg"
                      )}
                    >
                      {cell.value !== null
                        ? `0x${cell.value.toString(16)}`
                        : "0x00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// interface MemoryCell {
//   value: number | null;
//   address: number;
// }

// export function RAMSimulator() {
//   const [memorySize, setMemorySize] = useState<number>(8);
//   const [memory, setMemory] = useState<MemoryCell[]>(
//     Array.from({ length: memorySize }, (_, i) => ({ value: null, address: i }))
//   );
//   const [inputValue, setInputValue] = useState<string>("");
//   const [inputAddress, setInputAddress] = useState<string>("");
//   const isFull = memory.every((cell) => cell.value !== null);

//   const handleReset = () => {
//     setMemory(
//       Array.from({ length: memorySize }, (_, i) => ({
//         value: null,
//         address: i,
//       }))
//     );
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputAddress(e.target.value);
//   };

//   const handleAssignValue = () => {
//     const address = parseInt(inputAddress, 10);
//     const value = parseInt(inputValue, 10);

//     if (
//       !isNaN(address) &&
//       !isNaN(value) &&
//       address >= 0 &&
//       address < memorySize &&
//       !isFull
//     ) {
//       const newMemory = [...memory];
//       newMemory[address].value = value;
//       setMemory(newMemory);
//       setInputValue("");
//       setInputAddress("");
//     } else if (isFull) {
//       alert("La memoria está completamente llena.");
//     }
//   };

//   return (
//     <div className="w-full px-4 py-12 md:py-24 lg:px-6">
//       <div className="max-w-3xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold">RAM Simulator</h1>
//         <p className="text-gray-500 dark:text-gray-400">
//           Input values into specific memory addresses and perform read, write,
//           and clear operations.
//         </p>
//         <div className="grid w-full gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-medium" htmlFor="memory-address">
//               Memory Address
//             </label>
//             <Input
//               id="memory-address"
//               placeholder="Enter memory address"
//               value={inputAddress}
//               onChange={handleAddressChange}
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-medium" htmlFor="memory-value">
//               Memory Value
//             </label>
//             <Input
//               id="memory-value"
//               placeholder="Enter memory value"
//               value={inputValue}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//         <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
//           <Button disabled>Read</Button>
//           <Button onClick={handleAssignValue}>Write</Button>
//           <Button onClick={handleReset}>Clear</Button>
//         </div>
//         <div className="border border-gray-200 rounded-lg dark:border-gray-800">
//           <table className="min-w-full text-sm leading-normal">
//             <tbody>
//               {memory.map((cell) => (
//                 <tr
//                   key={cell.address}
//                   className="border-t border-gray-200 dark:border-gray-800"
//                 >
//                   <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
//                     {`0x${cell.address.toString(16).padStart(4, "0")}`}
//                   </td>
//                   <td className="px-4 py-3">
//                     {cell.value !== null
//                       ? `0x${cell.value.toString(16)}`
//                       : "0x00"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
