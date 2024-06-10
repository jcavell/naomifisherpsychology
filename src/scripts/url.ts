export const makeUrl = function(text: string){
  if (text === undefined) {console.log("UNDEFINED")}
  else{
    return text.toLowerCase().replace(/ /g, "-").replace(/[^a-z-0-9]/g, "")
  }
}
  
export const getImagePath = function (subdir:string, title:string, imageURL: string) {
  const suffix = imageURL.substring(imageURL.lastIndexOf('.'));
    return '/images/' + subdir + '/' + makeUrl(title) + suffix;
  
}

export function getCDNImagePath(publicImagePath: string): string {
  const isDev = import.meta.env.DEV;
  return publicImagePath
    ? isDev
      ? publicImagePath
      : `/.netlify/images?url=${publicImagePath}`
    : "/images/defaults/defaultBlogImage.jpeg";
}