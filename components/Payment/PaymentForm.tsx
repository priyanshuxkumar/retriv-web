"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AxiosInstance from "@/utils/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentFormSchema } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Script from "next/script";
import { useParams } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const countries = [
  { label: "United States", value: "us" },
  { label: "India", value: "in" },
];

const countryToCurrency : {[key : string]: string}= {
  us: "USD",
  in: "INR",
};

const useFetchPlanDetails = (id : ParamValue) => {
  const [amount, setAmount] = useState<number | null>(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(`/api/v1/plans/${id}`, {
          withCredentials: true,
        });
        if (response.data.success == true) {
          setAmount(response.data.data.amount);
        }
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);
  return {
    amount,
  };
};

export default function PaymentForm() {
  const { id } = useParams(); // Plan Id
  const { amount } = useFetchPlanDetails(id);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [currency, setCurrency] = useState<string>("INR");

  const form = useForm<z.infer<typeof PaymentFormSchema>>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
    },
  });

  const handleCreateOrder = async () => {
    try {
      const response = await AxiosInstance.post("/api/payment/checkout",
        {
          planId: id,
          currency: currency,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success == true) {
        return response.data.data.order_id;
      }
    } catch (err: unknown) {
      throw err;
    }
  }

  async function onSubmit(values: z.infer<typeof PaymentFormSchema>) {
    const orderId = await handleCreateOrder();
    try {
      if (!window.Razorpay) {
        alert(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency,
        name: "Retriv",
        description: "Payment for subscription",
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.mobileNumber,
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#F9F6F0",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", function (response: any) {
        alert(
          "Payment failed. Please try again. Error: " +
            response.error.description
        );
      });
    } catch (err: unknown) {
      console.error(err);
    }
  }

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      const verificationResponse = await AxiosInstance.post("/api/payment/verify",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (verificationResponse.data.success) {
        alert("Payment successful");
        router.push('/settings')
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Error verifying payment");
    }
  };

  const handleCurrency = (countryCode: string) => {
    setCurrency(countryToCurrency[countryCode]);
  };
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Confirm and Pay</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mb-4"
            aria-label="Payment form"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        aria-label="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="John@example.com"
                        aria-label="Email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Mobile number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="+91 9999999999"
                        aria-label="Mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCountry
                      ? selectedCountry.label
                      : "Select country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.value}
                            onSelect={() => {
                              setSelectedCountry(country);
                              handleCurrency(country.value as string);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountry?.value === country.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="business" />
              <label
                htmlFor="business"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I&apos;m purchasing as a business
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#556B2F] hover:bg-[#4A5F25] text-white"
              // disabled={!isCreating}
            >
              PAY NOW
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-500">
          By confirming your subscription, you allow the company to charge you
          for future payments in accordance with their terms. You can always
          cancel your subscription.
        </p>

        <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </>
  );
}
