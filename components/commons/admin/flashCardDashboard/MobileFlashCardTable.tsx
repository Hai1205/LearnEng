import { SpeakButton } from "./SpeakButton";
import {
  MobileDetailList,
  getRowNumber,
} from "@/components/commons/admin/adminTable/RenderMobileTabe";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";

interface MobileFlashCardTableProps {
  item: IFlashCard;
  index: number;
  paginationData?: PaginationData;
}

export const MobileFlashCardTable = ({
  item,
  index,
  paginationData,
}: MobileFlashCardTableProps) => {
  const no = getRowNumber(index, paginationData);
  const rows = [
    {
      label: "No",
      render: () => <span className="text-sm font-medium">{no}</span>,
    },
    {
      label: "Topic",
      render: (it: IFlashCard) => <>{it.topic}</>,
      capitalize: true,
    },
    {
      label: "Word",
      render: (it: IFlashCard) => <>{it.word}</>,
      capitalize: true,
    },
    {
      label: "Meaning",
      render: (it: IFlashCard) => <>{it.meaning}</>,
      capitalize: true,
    },
    { label: "IPA", render: (it: IFlashCard) => <>{it.ipa}</> },
    {
      label: "Voice",
      render: (it: IFlashCard) => <SpeakButton word={it.word} />,
    },
  ];

  return <MobileDetailList items={rows} item={item} index={index} />;
};
