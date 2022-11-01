// import * as ImagePicker from "expo-image-picker";


export const imagePicker = (mediaType) => new Promise(async (resolve, reject) => {
  // let res = await ImagePicker.launchImageLibraryAsync({
  //   mediaTypes: mediaType === 'photo' && ImagePicker.MediaTypeOptions.Images || mediaType === 'video' && ImagePicker.MediaTypeOptions.Videos || ImagePicker.MediaTypeOptions.All
  // });
  // if (!res.cancelled) {
  //  resolve(res)
  // }
  // else alert('دوباره امتحان کنید')
})


export const cameraPicker = (mediaType) => new Promise(async (resolve, reject) => {
  // let res = await ImagePicker.launchCameraAsync({
  //   mediaTypes: mediaType === 'photo' && ImagePicker.MediaTypeOptions.Images || mediaType === 'video' && ImagePicker.MediaTypeOptions.Videos || ImagePicker.MediaTypeOptions.All
  // });
  // if (!res.cancelled) {
  //  resolve(res)
  // }
  // else alert('دوباره امتحان کنید')
})
