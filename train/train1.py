import json
import os

# JSONL 文件路径
import os

# 获取当前脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
jsonl_file = os.path.join(script_dir, "medical_chatbot_data.jsonl")

print(f"JSONL 文件路径: {jsonl_file}")


def add_new_data():
    """
    允许用户手动输入新数据并追加到 JSONL 文件
    """
    messages = []
    
    # 设定 AI 的角色
    system_prompt = input("请输入 AI 角色描述 (默认为: 你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南): ")
    if not system_prompt:
        system_prompt = "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"
    messages.append({"role": "system", "content": system_prompt})

    while True:
        user_input = input("请输入用户的问题 (输入 'exit' 结束): ")
        if user_input.lower() == "exit":
            break
        assistant_response = input("请输入 AI 的回答: ")

        messages.append({"role": "user", "content": user_input})
        messages.append({"role": "assistant", "content": assistant_response})

    # 创建新的 JSON 结构
    new_entry = {"messages": messages}

    # 追加到 JSONL 文件
    with open(jsonl_file, "a", encoding="utf-8") as file:
        file.write(json.dumps(new_entry, ensure_ascii=False) + "\n")
    
    print("✅ 新数据已成功添加到 JSONL 文件！")


def add_bulk_data():
    """
    批量添加医疗相关数据
    """
    bulk_data = [
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "老年人如何预防跌倒？"},
            {"role": "assistant", "content": "预防跌倒对老年人非常重要：1. **增强锻炼**：进行平衡和力量训练，如太极拳、散步。 2. **家居安全**：移除地毯、电线等障碍物，保持地面干燥，安装扶手。3. **视力检查**：定期检查视力，确保眼镜度数合适。4. **药物审查**：有些药物可能增加跌倒风险，请医生审查用药。5. **穿防滑鞋**。6. **使用助行器**：如果需要，使用拐杖或助行器。"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "老年人记忆力下降怎么办？"},
            {"role": "assistant", "content": "记忆力下降是衰老的一部分，但可以采取措施减缓：1. **保持活跃**：参加社交活动、学习新技能、玩益智游戏。2. **健康饮食**：多吃蔬菜、水果、全谷物、鱼类，减少饱和脂肪和糖的摄入。3. **充足睡眠**：保证每晚7-8小时睡眠。4. **控制慢性病**：如高血压、糖尿病等会影响认知功能。5. **药物影响**：某些药物可能影响记忆，请咨询医生。6. **认知训练**：进行专业的认知训练。如果记忆力下降严重，影响日常生活，请及时就医。"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "我父亲最近被诊断为阿尔茨海默病，早期有哪些症状需要特别注意？"},
            {"role": "assistant", "content": "阿尔茨海默病早期症状可能包括：1. **记忆力减退**：忘记最近发生的事情、重复提问。2. **计划和解决问题困难**。3. **完成熟悉任务困难**。4. **时间、地点混淆**。5. **语言表达困难**：找词困难、命名困难。6. **判断力下降**。7. **情绪、性格改变**。8. **社交退缩**。如果您父亲出现这些症状，并逐渐加重，请及时就医并寻求专业支持。"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "老年人接种流感疫苗和肺炎疫苗重要吗？"},
            {"role": "assistant", "content": "非常重要。老年人免疫力下降，更容易感染流感和肺炎，接种疫苗可以有效预防这些疾病及其并发症。建议每年接种流感疫苗，并根据医生建议接种肺炎疫苗。"}
        ]
    },
     {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content":"老年人经常便秘怎么办？"},
            {"role":"assistant", "content":"老年人便秘常见，可以尝试：1. **增加膳食纤维**：多吃蔬菜、水果、全谷物。2. **多喝水**：每天1.5-2升。3. **适量运动**：促进肠道蠕动。4. **养成规律排便习惯**。5. **避免滥用泻药**。6. **药物影响**：某些药物可能导致便秘，请咨询医生。如果便秘严重或伴有其他症状，请及时就医。"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "老年人服用多种药物，如何避免药物相互作用？"},
            {"role": "assistant", "content": "避免药物相互作用很重要：1. **告知医生所有用药**：包括处方药、非处方药、保健品、中药。2. **固定药房取药**：药师可以帮助审查药物。3. **了解药物**：了解每种药物的名称、作用、用法、不良反应。4. **按医嘱服药**：不要自行调整剂量或停药。5. **注意药物与食物的相互作用**：如葡萄柚汁可能影响某些药物。6. **使用药盒**：帮助按时服药。7. **定期复诊**：医生可以根据情况调整用药。"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "你是一位经验丰富的医生，专门为老年人提供健康咨询和用药指南。"},
            {"role": "user", "content": "老年人如何保护关节，预防关节炎？"},
            {"role": "assistant", "content": "保护关节，预防关节炎：1. **控制体重**：减轻关节负担。2. **适度运动**：增强关节周围肌肉力量，如游泳、散步。3. **避免过度使用关节**：避免长时间重复同一动作。4. **注意保暖**：寒冷可能加重关节疼痛。5. **补充钙和维生素D**。6. **早期诊断和治疗**：如果出现关节疼痛、僵硬等症状，及时就医。"}
        ]
    }
]

    # 追加批量数据到 JSONL 文件
    with open(jsonl_file, "a", encoding="utf-8") as file:
        for entry in bulk_data:
            file.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print("✅ 批量数据已成功添加到 JSONL 文件！")


def check_jsonl_format():
    """
    读取 JSONL 文件并检查数据格式
    """
    if not os.path.exists(jsonl_file):
        print("❌ 文件不存在，请先添加数据！")
        return

    with open(jsonl_file, "r", encoding="utf-8") as file:
        lines = file.readlines()
    
    print(f"📂 文件包含 {len(lines)} 条数据，显示前 3 条数据示例：\n")
    for line in lines[:3]:
        try:
            data = json.loads(line)
            print(json.dumps(data, indent=4, ensure_ascii=False))
        except json.JSONDecodeError:
            print("❌ JSON 格式错误，请检查文件！")


def main():
    while True:
        print("\n📌 请选择操作：")
        print("1️⃣  手动添加新数据")
        print("2️⃣  批量添加医疗相关数据")
        print("3️⃣  检查 JSONL 文件格式")
        print("4️⃣  退出")
        choice = input("输入选项（1-4）：")

        if choice == "1":
            add_new_data()
        elif choice == "2":
            add_bulk_data()
        elif choice == "3":
            check_jsonl_format()
        elif choice == "4":
            print("✅ 退出程序！")
            break
        else:
            print("❌ 选项无效，请重新输入！")


if __name__ == "__main__":
    main()
