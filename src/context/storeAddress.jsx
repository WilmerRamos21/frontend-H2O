import { create } from "zustand";
import { persist } from "zustand/middleware";
import storeAuth from "./storeAuth";

const userAddressStore = create (
    persist(
        (set) => ({
            addresses: [],

            setAddresses: (newAddresses) => set({
                addresses: newAddresses
            }),

            clearAddresses: () => set({
                addresses: []
            }),
        }), 
        {name: "address-storage"}
    )
)

export default userAddressStore