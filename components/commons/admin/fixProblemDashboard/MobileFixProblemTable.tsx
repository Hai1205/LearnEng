import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import {
  MobileDetailList,
  getRowNumber,
} from "@/components/commons/admin/adminTable/RenderMobileTabe";

interface MobileFixProblemTableProps {
  item: IFixProblem;
  index: number;
  paginationData?: PaginationData;
}

export const MobileFixProblemTable = ({
  item,
  index,
  paginationData,
}: MobileFixProblemTableProps) => {
  const no = getRowNumber(index, paginationData);
  const rows = [
    {
      label: "No",
      render: () => <span className="text-sm font-medium">{no}</span>,
    },
    {
      label: "Category",
      render: (it: IFixProblem) => <>{it.category}</>,
      capitalize: true,
    },
    {
      label: "Question",
      render: (it: IFixProblem) => (
        <span className="line-clamp-2">{it.question}</span>
      ),
    },
    {
      label: "Answer",
      render: (it: IFixProblem) => <>{it.answer}</>,
      capitalize: true,
    },
  ];

  return <MobileDetailList items={rows} item={item} index={index} />;
};
