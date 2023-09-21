import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded!");
  }

  return data;
}

export async function createUpdateCabin(newCabin, id) {
  // having id will determine if it's create or edit(id exitst)
  const hasImagePath = typeof newCabin.image === "string";
  let imageName = undefined;
  if (!hasImagePath) {
    imageName = `${Math.round(Math.random() * 100000000)}-${
      newCabin.image.name
    }`.replaceAll("/", "");
  }

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  if (!hasImagePath) {
    // 1.Uploading the image
    const { error: imageUploadError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (imageUploadError) {
      console.error(imageUploadError);
      throw new Error("Cabin image could not be uploaded!");
    }
  }

  // will only upload the cabin data once there is no error uploading the image
  let query = supabase.from("cabins");
  if (id) {
    // edit cabin case
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  } else {
    // create cabin case
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }
  const { data, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted!");
  }

  return data;
}
