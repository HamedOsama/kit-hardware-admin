import { useRouter } from "next/router";

const useGetLocation = () => {
  const router = useRouter();
  const { pathname } = router;
  const paths = pathname.split("/");
  const formattedPaths = paths.map(e => {
    const arr = e.split("");
    arr.unshift("/");
    const str =  arr.join('');
    return str;
  }
  )
  // const pathsJSX = <div className="py-2">
  //         ${paths.map((path, index) => (
  //           `<>
  //             ${index < paths.length - 1 ?
  //               `<Link key=${index} href=${path}>
  //                 ${path === '/' ? 'Home' : path.substring(1)}
  //               </Link>`
  //               :
  //               `<span className='text-gray-600' key=${index}>${path === '/' ? 'Home' : path.substring(1)}</span>`
  //           }
  //             ${index < paths.length - 1 ? `<span key=${index}> &gt; </span>` : null}
  //           </>`
  //         ))}
  //       </div>
  
  return formattedPaths;
}
export default useGetLocation;