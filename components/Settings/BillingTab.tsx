import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceCard from "../PriceCard";
import { useRouter } from "next/navigation";

export default function SettingsBillingTab() {
  const router = useRouter();
  const handlePushToBillingPage = async() => {
    router.push(`/checkout/billing`)
  }
  return (
    <>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your subscription and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col justify-center items-center">
            <PriceCard />
            <Button
              onClick={handlePushToBillingPage}
              className="mt-4 cursor-pointer h-10 text-base"
            >
              Buy now
            </Button>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">
                  $29/month, billed monthly
                </p>
              </div>
              <Badge>Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
