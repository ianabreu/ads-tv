import { ReactNode } from "react";
import { Loading } from "./loading";
import { EmptyList, EmptyListType } from "./empty-list";

interface GridProps {
  loading: boolean;
  isEmpty: boolean;
  children?: ReactNode;
  emptyType?: EmptyListType;
}

export function Grid({ loading, isEmpty, children, emptyType }: GridProps) {
  return (
    <div>
      {loading && <Loading />}
      {!loading && isEmpty && <EmptyList type={emptyType} />}
      {!loading && !isEmpty && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
          {children}
        </div>
      )}
    </div>
  );
}
