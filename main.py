def calculate_paye(salary):
    if salary <= 24001:
        tax = 0.1 * salary
    elif salary <= 40000:
        tax = 2400 + 0.15 * (salary - 24000)
    elif salary <= 80000:
        tax = 5400 + 0.2 * (salary - 40000)
    elif salary <= 180000:
        tax = 13400 + 0.25 * (salary - 80000)
    else:
        tax = 36500 + 0.3 * (salary - 180000)
    
    return tax

def main():
    try:
        salary = float(input("Enter your monthly salary in KES: "))
        if salary < 0:
            raise ValueError("Salary cannot be negative.")
        
        tax = calculate_paye(salary)
        print(f"Your PAYE tax is: KES {tax:.2f}")
    except ValueError as e:
        print("Invalid input:", e)

if __name__ == "__main__":
    main()
