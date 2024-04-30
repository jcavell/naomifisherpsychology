export const makeUrl = function(text: string){
    return text.toLowerCase().replace(/ /g, "-").replace(/\?/g, "");
}
  
export const getCourseImagePath = function (imageUrl: string) {
  const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  return '/images/courses/' + imageName;

}