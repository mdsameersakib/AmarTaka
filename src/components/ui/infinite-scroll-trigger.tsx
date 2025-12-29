import { useEffect, useRef } from "react";

type InfiniteScrollTriggerProps = {
  onIntersect: () => void;
};

export function InfiniteScrollTrigger({
  onIntersect,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1.0 },
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onIntersect]);

  return <div ref={triggerRef} className="h-4 w-full" />;
}
