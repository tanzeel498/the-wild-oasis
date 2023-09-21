import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useUpdateCabin() {
  const queryClient = useQueryClient();

  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newCabinData, id }) => createUpdateCabin(newCabinData, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["cabins"]);
      toast.success("Cabin edited successfully!");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateCabin };
}
