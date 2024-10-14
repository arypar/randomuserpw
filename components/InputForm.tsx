"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  link: z.string().url({ message: "Please enter a valid URL" }),
})

export function InputForm() {
  const [gameData, setGameData] = useState<{ playerID: string; playerName: string; buyInSum: string; buyOutSum: string; inGame: string; net: string; }[]>([]); // Changed from null to an empty array
  type Player = { playerID: string; playerName: string; buyInSum: string; buyOutSum: string; inGame: string; net: string; };
  
  type Transaction = {
    from: string;
    to: string;
    amount: string; // Amount is also stored as a string with a dollar sign
  };

  
  function settlePokerGame(playersData: Player[]): Transaction[] {
    // Step 1: Separate creditors (positive net) and debtors (negative net)
    const creditors: { playerName: string; amount: number }[] = [];
    const debtors: { playerName: string; amount: number }[] = [];
  
    playersData.forEach(player => {
      const net = parseFloat(player.net)
      if (net > 0) {
        creditors.push({ playerName: player.playerName, amount: net }); // Positive net (owed money)
      } else if (net < 0) {
        debtors.push({ playerName: player.playerName, amount: -net }); // Negative net (owes money)
      }
    });
  
    const transactions: Transaction[] = [];
  
    // Step 2: Pair creditors and debtors
    let i = 0; // Index for creditors
    let j = 0; // Index for debtors
  
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
  
      // Calculate the payment amount
      const payment = Math.min(creditor.amount, debtor.amount);
  
      // Record the transaction
      transactions.push({
        from: debtor.playerName,
        to: creditor.playerName,
        amount: `${payment}`
      });
  
      // Update the amounts
      creditor.amount -= payment;
      debtor.amount -= payment;
  
      // Move to the next creditor or debtor if fully paid
      if (creditor.amount === 0) i++;
      if (debtor.amount === 0) j++;
    }
  
    return transactions;
  }
  





  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission here
    console.log(values)
    const res = await fetch('https://cors-anywhere.herokuapp.com/' + values.link + '/players_sessions', {
      headers : {
        'origin' : '*'
      }
    })
    let data = await res.json()
    let playersData = await Object.keys(data.playersInfos).map(playerID => {
      const player = data.playersInfos[playerID];
      return {
        playerID: playerID,
        playerName: player.names[0],
        buyInSum: `${player.buyInSum/100}`,
        buyOutSum: `${player.buyOutSum/100}`,
        inGame: `${player.inGame/100}`,
        net: `${player.net/100}`
      };
    });
    playersData.sort((a, b) => parseFloat(b.net) - parseFloat(a.net))
    setGameData(playersData)
    console.log(settlePokerGame(playersData))
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter PokerNow Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter a valid URL to process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

      </div>

      <div className="w-full max-w-md">
      <Table>
      <TableCaption>Poker Ledger</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Player Name</TableHead>
          <TableHead>Buy In</TableHead>
          <TableHead>Buy Out</TableHead>
          <TableHead className="text-right">Net</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gameData.map((player) => (
          <TableRow key={player.playerID}>
            <TableCell className="font-medium">{player.playerName}</TableCell>
            <TableCell>{player.buyInSum}</TableCell>
            <TableCell>{player.buyOutSum}</TableCell>
            <TableCell className="text-right">{player.net}</TableCell>
          </TableRow>
        ))}
      </TableBody>

       
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">0</TableCell>
        </TableRow>
      </TableFooter>
      
    </Table>
</div>
      
    </div>





  )
}
export default InputForm;