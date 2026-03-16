import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import {
  MobileDetailList,
  getRowNumber,
} from "@/components/commons/admin/adminTable/RenderMobileTabe";

interface MobileQuizzTableProps {
  item: IQuizz;
  index: number;
  paginationData?: PaginationData;
}

export const MobileQuizzTable = ({
  item,
  index,
  paginationData,
}: MobileQuizzTableProps) => {
  const no = getRowNumber(index, paginationData);
  const rows = [
    {
      label: "No",
      render: () => <span className="text-sm font-medium">{no}</span>,
    },
    {
      label: "Category",
      render: (it: IQuizz) => <>{it.category}</>,
      capitalize: true,
    },
    {
      label: "Topic",
      render: (it: IQuizz) => <>{it.topic}</>,
      capitalize: true,
    },
    {
      label: "Level",
      render: (it: IQuizz) => (
        <div className="inline-flex items-center gap-2 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              it.level === "Dễ"
                ? "bg-emerald-500/20 text-emerald-500"
                : it.level === "Trung bình"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-rose-500/20 text-rose-500"
            }`}
          />
          <span className="capitalize">{it.level}</span>
        </div>
      ),
    },
    {
      label: "Question",
      render: (it: IQuizz) => (
        <span className="line-clamp-2">{it.question}</span>
      ),
    },
  ];

  return <MobileDetailList items={rows} item={item} index={index} />;
};
