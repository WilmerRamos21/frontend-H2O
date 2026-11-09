import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialProfile = {
    nombre: "",
    apellido: "",
    email:"",
    telefono: "",
    _id:""
}

const storeProfile = create(
    persist(
        (set) => ({
            profile: initialProfile,
        
            setProfile: (userData) => {
                if (!userData) return;

                // Normalizamos los nombres de los campos

                const user = userData.user || userData;
                
                set({
                    profile: {
                        nombre: user.nombre || user.name || "",
                        apellido: user.apellido || user.lastname || "",
                        email: user.email || "",
                        telefono: user.telefono || user.phone || "",
                        _id: user._id || ""
                    }
                });
            },

            clearProfile: () => set({
                profile: initialProfile
            })
        }),
        { name: "profile-storage" }
    )
);

export default storeProfile;