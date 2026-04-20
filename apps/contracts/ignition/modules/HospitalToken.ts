import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const HospitalTokenModule = buildModule("HospitalTokenModule", (m) => {
  const name = m.getParameter("name", "Hospital Network Token");
  const symbol = m.getParameter("symbol", "HNT");
  const admin = m.getParameter("admin");
  const initialRecipient = m.getParameter("initialRecipient", admin);
  const initialSupply = m.getParameter("initialSupply", parseEther("1000000"));
  const maxSupply = m.getParameter("maxSupply", parseEther("10000000"));

  const hospitalToken = m.contract("HospitalToken", [
    name,
    symbol,
    admin,
    initialRecipient,
    initialSupply,
    maxSupply,
  ]);

  return { hospitalToken };
});

export default HospitalTokenModule;
