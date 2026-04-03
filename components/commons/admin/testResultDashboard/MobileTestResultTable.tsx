import {
  MobileDetailList,
  getRowNumber,
} from "@/components/commons/admin/adminTable/RenderMobileTabe";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";

interface MobileTestResultTableProps {
  item: ITestResult;
  index: number;
  paginationData?: PaginationData;
}

export const MobileTestResultTable = ({
  item,
  index,
  paginationData,
}: MobileTestResultTableProps) => {
  const no = getRowNumber(index, paginationData);
  const rows = [
    {
      label: "No",
      render: () => <span className="text-sm font-medium">{no}</span>,
    },
    {
      label: "Category",
      render: (it: ITestResult) => <>{it.category}</>,
      capitalize: true,
    },
    {
      label: "Title",
      render: (it: ITestResult) => <>{it.title}</>,
      capitalize: true,
    },
    { label: "Part 1", render: (it: ITestResult) => <>{it.part1}</> },
    { label: "Part 2", render: (it: ITestResult) => <>{it.part2}</> },
    { label: "Part 3", render: (it: ITestResult) => <>{it.part3}</> },
    { label: "Part 4", render: (it: ITestResult) => <>{it.part4}</> },
    { label: "Part 5", render: (it: ITestResult) => <>{it.part5}</> },
    { label: "Part 6", render: (it: ITestResult) => <>{it.part6}</> },
    { label: "Part 7", render: (it: ITestResult) => <>{it.part7}</> },
    {
      label: "Score",
      render: (it: ITestResult) => (
        <>
          {it.score ??
            it.part1 +
              it.part2 +
              it.part3 +
              it.part4 +
              it.part5 +
              it.part6 +
              it.part7}
        </>
      ),
    },
  ];

  return <MobileDetailList items={rows} item={item} index={index} />;
};
