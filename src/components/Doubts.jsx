import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Doubts = () => {
  return (
    <div className="mt-10 ">
      <Accordion type="single" collapsible className="mt-10">
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-secondary backdrop-blur-sm p-5 rounded-t-xl rounded-b-none">
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent className="bg-secondary backdrop-blur-sm rounded-b-xl p-5">
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Doubts;
