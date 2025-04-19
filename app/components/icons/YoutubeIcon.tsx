interface IconProps {
  className?: string;
}

export function YoutubeIcon({className}: IconProps) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0.955078" width="21.0286" height="15.7051" rx="3" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3386 8.11108C14.4828 8.18563 14.4828 8.39184 14.3386 8.46639L9.1328 11.158C8.99967 11.2269 8.84094 11.1302 8.84094 10.9804V5.5971C8.84094 5.44723 8.99967 5.35061 9.1328 5.41944L14.3386 8.11108Z"
        fill="white"
      />
    </svg>
  );
} 