export const makeUrl = function(text: string){
    return text.toLowerCase().replace(/ /g, "-").replace(/\?/g, "");
}
  
export const getImagePath = function (subdir:string, title:string, imageURL: string) {
  const suffix = imageURL.substring(imageURL.lastIndexOf('.'));
    return '/images/' + subdir + '/' + title.toLowerCase().replace(/ /g, "-").replace(/\?/g, "") + suffix;
  
}