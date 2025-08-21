import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <div>
      <div className="flex flex-col  justify-center gap-y-2.5 mt-40 ">
        <h1 className="sm:text-8xl md:text-10xl text-8xl font-black">Encly,</h1>
        <p className="sm:text-xl md:text-md  text-slate-400 text-right ">
          snip it safe.
        </p>
      </div>
      <form className="flex flex-col gap-y-5 mt-20 items-center">
        <Input placeholder="Paste Your Lynk" />
        <Button className="cursor-pointer text-white w-full">Encly</Button>
      </form>

      {/* {ABOUT} */}

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
